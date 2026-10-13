-- Open Physics Notes — Portuguese (Brasil) / pt-BR
-- EXISTING DATABASE UPDATE. Run this entire file once in the correct
-- Supabase project's SQL Editor as the database owner. Safe to run again.
--
-- Only the existing content_locale CHECK is extended. All current accepted
-- locales, comment rows, RLS, grants, RPCs, triggers and rate limits are retained.
-- Do not run the original CREATE TABLE script against an existing database.
-- This file has been tested locally, not executed against your production DB.
--
-- Save the returned original_constraint and rollback_sql after the first run.
-- The rollback refuses to invalidate any comments added since this update.
-- On an error, the transaction is aborted: issue ROLLBACK before another query.

BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '30s';

DO $migration$
DECLARE
  table_oid oid;
  locale_attnum smallint;
  locale_type oid;
  locale_not_null boolean;
  locale_check_count integer;
  old_check record;
  old_comment text;
  old_expression text;
  new_expression text;
  new_definition text;
  permits_pt_br boolean;
  rollback_sql text;
BEGIN
  table_oid := pg_catalog.to_regclass('public.discussion_comments');
  IF table_oid IS NULL THEN
    RAISE EXCEPTION 'discussion_comments is missing. Use the separate fresh-install SQL only for a new installation.';
  END IF;

  -- Hold a short exclusive lock so the inspected CHECK cannot change mid-update.
  LOCK TABLE public.discussion_comments IN ACCESS EXCLUSIVE MODE;
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_class c
    WHERE c.oid = table_oid AND c.relkind = 'r' AND NOT c.relispartition
      AND c.relrowsecurity
  ) OR EXISTS (
    SELECT 1 FROM pg_catalog.pg_inherits i
    WHERE i.inhrelid = table_oid OR i.inhparent = table_oid
  ) THEN
    RAISE EXCEPTION 'Unexpected table structure or disabled RLS. No change was applied; review the live schema.';
  END IF;

  SELECT a.attnum, a.atttypid, a.attnotnull
    INTO locale_attnum, locale_type, locale_not_null
  FROM pg_catalog.pg_attribute a
  WHERE a.attrelid = table_oid AND a.attname = 'content_locale' AND NOT a.attisdropped;
  IF NOT FOUND OR locale_type <> 'pg_catalog.text'::regtype OR NOT locale_not_null THEN
    RAISE EXCEPTION 'Expected a non-null text content_locale column. No change was applied.';
  END IF;

  SELECT count(*) INTO locale_check_count
  FROM pg_catalog.pg_constraint c
  WHERE c.conrelid = table_oid AND c.contype = 'c'
    AND locale_attnum = ANY(c.conkey);
  IF locale_check_count <> 1 THEN
    RAISE EXCEPTION 'Expected exactly one content_locale CHECK, found %. No change was applied.', locale_check_count;
  END IF;

  SELECT c.oid, c.conname, c.convalidated, c.connoinherit, c.conislocal,
    c.coninhcount, c.conkey,
    pg_catalog.pg_get_constraintdef(c.oid, true) AS definition
  INTO old_check
  FROM pg_catalog.pg_constraint c
  WHERE c.conrelid = table_oid AND c.contype = 'c'
    AND locale_attnum = ANY(c.conkey);
  IF NOT old_check.convalidated OR NOT old_check.conislocal
    OR old_check.coninhcount <> 0
    OR old_check.conkey <> ARRAY[locale_attnum]::smallint[] THEN
    RAISE EXCEPTION 'Expected a validated local single-column locale CHECK. No change was applied.';
  END IF;

  SELECT pg_catalog.pg_get_expr(c.conbin, c.conrelid, true),
    pg_catalog.obj_description(c.oid, 'pg_constraint')
    INTO old_expression, old_comment
  FROM pg_catalog.pg_constraint c WHERE c.oid = old_check.oid;

  -- Evaluate the actual current predicate; a rerun becomes a no-op.
  -- SQL CHECK accepts TRUE or NULL, and the separate NOT NULL is retained.
  EXECUTE pg_catalog.format(
    'SELECT coalesce((%s), true) FROM (VALUES ($1::text)) AS probe(content_locale)',
    old_expression
  ) INTO permits_pt_br USING 'pt-BR';
  IF permits_pt_br THEN
    PERFORM pg_catalog.set_config('openphysicsnotes.pt_br_migration_result',
      pg_catalog.jsonb_build_object(
        'status', 'already_enabled',
        'locale', 'pt-BR',
        'label', 'Portuguese (Brasil)',
        'constraint_name', old_check.conname,
        'current_constraint', old_check.definition,
        'message', 'The existing CHECK already accepts pt-BR; no schema or data changed.'
      )::text, false);
    RETURN;
  END IF;

  -- Preserve the entire live predicate, including locales absent from old files.
  new_expression := '(' || old_expression || ') OR (content_locale = ''pt-BR''::text)';
  EXECUTE pg_catalog.format(
    'ALTER TABLE public.discussion_comments DROP CONSTRAINT %I', old_check.conname);
  EXECUTE pg_catalog.format(
    'ALTER TABLE public.discussion_comments ADD CONSTRAINT %I CHECK (%s)%s',
    old_check.conname, new_expression,
    CASE WHEN old_check.connoinherit THEN ' NO INHERIT' ELSE '' END);
  IF old_comment IS NOT NULL THEN
    EXECUTE pg_catalog.format(
      'COMMENT ON CONSTRAINT %I ON public.discussion_comments IS %L',
      old_check.conname, old_comment);
  END IF;

  SELECT pg_catalog.pg_get_constraintdef(c.oid, true) INTO new_definition
  FROM pg_catalog.pg_constraint c
  WHERE c.conrelid = table_oid AND c.conname = old_check.conname;

  -- The generated rollback is bound to this exact before/after definition.
  -- It never deletes or relabels comments. If the original CHECK would reject
  -- newer rows, restoration fails and transaction rollback keeps everything.
  rollback_sql := pg_catalog.format($rollback$
-- Recovery for this exact Open Physics Notes locale change only.
-- Run in the same verified Supabase project. Retain all comment data.
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '30s';
LOCK TABLE public.discussion_comments IN ACCESS EXCLUSIVE MODE;
DO $rollback_guard$
BEGIN
  IF (SELECT pg_catalog.pg_get_constraintdef(c.oid, true)
      FROM pg_catalog.pg_constraint c
      WHERE c.conrelid = 'public.discussion_comments'::regclass
        AND c.conname = %L) IS DISTINCT FROM %L THEN
    RAISE EXCEPTION 'Constraint changed since this migration; rollback aborted.';
  END IF;
END
$rollback_guard$;
ALTER TABLE public.discussion_comments DROP CONSTRAINT %I;
ALTER TABLE public.discussion_comments ADD CONSTRAINT %I %s;
COMMENT ON CONSTRAINT %I ON public.discussion_comments IS %L;
COMMIT;
$rollback$, old_check.conname, new_definition,
    old_check.conname, old_check.conname, old_check.definition,
    old_check.conname, old_comment);

  PERFORM pg_catalog.set_config('openphysicsnotes.pt_br_migration_result',
    pg_catalog.jsonb_build_object(
      'status', 'enabled',
      'locale', 'pt-BR',
      'label', 'Portuguese (Brasil)',
      'constraint_name', old_check.conname,
      'original_constraint', old_check.definition,
      'current_constraint', new_definition,
      'rollback_sql', rollback_sql,
      'message', 'pt-BR added. Existing locales, comments and security settings retained. Save this result.'
    )::text, false);
END
$migration$;

COMMIT;

-- Supabase SQL Editor shows this result after the transaction succeeds.
SELECT pg_catalog.current_setting('openphysicsnotes.pt_br_migration_result', true)::jsonb
  AS migration_result;
