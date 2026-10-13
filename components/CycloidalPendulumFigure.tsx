import './cycloidal-pendulum.css';
const copy = {
  en: {
    circular: 'A. Ordinary pendulum: a circular arc', cycloidal: 'B. Huygens’ pendulum: a cycloidal arc',
    circularAlt: 'An ordinary pendulum hangs from a fixed pivot on a straight string of length L = 4a. Its bob follows the dashed blue circular arc.',
    cycloidalAlt: 'Two fixed cycloidal cheeks flank the suspension point. The orange string follows the right cheek to its contact point, then leaves tangentially as a straight free segment ending at the bob on the dashed blue cycloidal path.',
    legend: '1 Suspension · 2 Fixed cycloidal cheeks · 3 String in contact · 4 Free string · 5 Bob · 6 Bob’s path (blue)',
    caption: 'The string has the same total length, 4a, in both drawings. In B, more string wraps around a cheek as the bob moves away from the bottom, shortening the free part. The cheeks are the evolute of the bob’s path; the bob traces their involute, another cycloid. The blue curve is the actual bob path, not a wheel rolling beneath the pendulum. a is the radius of the circle that mathematically generates these cycloids.',
  },
  ja: {
    circular: 'A. 普通の振り子：円弧を描く', cycloidal: 'B. ホイヘンスの振り子：サイクロイドを描く',
    circularAlt: '固定した支点から長さL＝4aのまっすぐな糸でおもりを吊るした普通の振り子。おもりは青い破線の円弧を描く。',
    cycloidalAlt: '支点の両側に固定したサイクロイド形の頬板。オレンジ色の糸は右の頬板に沿って接触点まで巻き付き、そこから接線方向にまっすぐ伸びる。先端のおもりは青い破線のサイクロイド上にある。',
    legend: '1 支点 · 2 固定したサイクロイド形の頬板 · 3 板に接する糸 · 4 自由に伸びる糸 · 5 おもり · 6 おもりの軌道（青）',
    caption: '糸の全長はどちらも4a。Bでは、おもりが最下点から離れるほど糸が頬板に巻き付き、自由な部分が短くなる。頬板はおもりの軌道の縮閉線であり、糸をほどいた先端が描く伸開線もサイクロイドになる。青い曲線は実際のおもりの軌道で、下で車輪を転がす仕組みではない。aは、これらのサイクロイドを数学的に生成する円の半径である。',
  },
  'zh-CN': {
    circular: 'A. 普通单摆：圆弧轨道', cycloidal: 'B. 惠更斯摆：摆线轨道',
    circularAlt: '普通单摆用长度L＝4a的直绳悬挂在固定支点上。摆球沿蓝色虚线圆弧运动。',
    cycloidalAlt: '支点两侧固定着摆线形导板。橙色绳沿右导板绕到接触点，再沿切线方向伸出直的自由段，末端摆球位于蓝色虚线摆线轨道上。',
    legend: '1 支点 · 2 固定的摆线形导板 · 3 与导板接触的绳段 · 4 自由绳段 · 5 摆球 · 6 摆球轨道（蓝色）',
    caption: '两图中绳的总长度都是4a。B中，摆球离最低点越远，绳绕在导板上的部分越长，自由段越短。导板是摆球轨道的渐屈线；绳端描出的渐伸线也是摆线。蓝色曲线是摆球的实际轨道，并不是让轮子在摆下方滚动的装置。a是数学上生成这些摆线的圆的半径。',
  },
  de: {
    circular: 'A. Gewöhnliches Pendel: Kreisbogen', cycloidal: 'B. Huygens-Pendel: Zykloidenbogen',
    circularAlt: 'Ein gewöhnliches Pendel hängt an einem geraden Faden der Länge L = 4a von einem festen Aufhängepunkt. Die Masse folgt dem blau gestrichelten Kreisbogen.',
    cycloidalAlt: 'Zwei feste Zykloidenbacken flankieren den Aufhängepunkt. Der orange Faden liegt bis zum Kontaktpunkt an der rechten Backe an und verläuft danach tangential als gerades freies Stück zur Masse auf der blau gestrichelten Zykloide.',
    legend: '1 Aufhängung · 2 Feste Zykloidenbacken · 3 Anliegender Faden · 4 Freier Faden · 5 Pendelmasse · 6 Bahn der Masse (blau)',
    caption: 'Die gesamte Fadenlänge beträgt in beiden Bildern 4a. In B wickelt sich beim Auslenken mehr Faden um eine Backe; das freie Stück wird kürzer. Die Backen bilden die Evolute der Bahn; die Fadenspitze zeichnet deren Evolvente, wieder eine Zykloide. Blau ist die tatsächliche Bahn der Masse dargestellt, kein Rad unter dem Pendel. a ist der Radius des Kreises, der diese Zykloiden mathematisch erzeugt.',
  },
  'pt-BR': {
    circular: 'A. Pêndulo comum: arco de círculo', cycloidal: 'B. Pêndulo de Huygens: arco de cicloide',
    circularAlt: 'Um pêndulo comum fica suspenso por um fio reto de comprimento L = 4a preso a um ponto fixo. A massa percorre o arco circular tracejado em azul.',
    cycloidalAlt: 'Duas guias cicloidais fixas ladeiam o ponto de suspensão. O fio laranja acompanha a guia direita até o ponto de contato e sai tangencialmente em um trecho reto e livre até a massa, situada na trajetória cicloidal tracejada em azul.',
    legend: '1 Suspensão · 2 Guias cicloidais fixas · 3 Fio em contato · 4 Fio livre · 5 Massa · 6 Trajetória da massa (azul)',
    caption: 'O comprimento total do fio é 4a nas duas figuras. Em B, quanto mais a massa se afasta do ponto mais baixo, mais fio se enrola na guia, encurtando o trecho livre. As guias são a evoluta da trajetória; a ponta do fio descreve sua involuta, outra cicloide. A curva azul é a trajetória real da massa, não uma roda rolando sob o pêndulo. a é o raio do círculo que gera matematicamente essas cicloides.',
  },
};
export default function CycloidalPendulumFigure({ locale }: { locale: keyof typeof copy }) {
  const t = copy[locale];
  return <figure className="cycloidal-pendulum-figure">
    <div className="cycloidal-pendulum-panels">
      <div><p className="cycloidal-pendulum-label">{t.circular}</p><img src="/images/diagrams/pendulum-circular-comparison.svg" alt={t.circularAlt} width={450} height={390} loading="lazy"/></div>
      <div><p className="cycloidal-pendulum-label">{t.cycloidal}</p><img src="/images/diagrams/pendulum-cycloidal-cheeks.svg" alt={t.cycloidalAlt} width={450} height={390} loading="lazy"/></div>
    </div>
    <figcaption><p>{t.legend}</p><p>{t.caption}</p></figcaption>
  </figure>;
}
