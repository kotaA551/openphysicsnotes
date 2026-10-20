import './cycloidal-pendulum.css';
const copy = {
  fr: {
    circular: 'A. Pendule ordinaire : un arc de cercle', cycloidal: 'B. Pendule de Huygens : un arc de cycloïde',
    circularAlt: 'Un pendule ordinaire est suspendu à un point fixe par un fil rectiligne de longueur L = 4a. Sa masse suit l’arc de cercle bleu en pointillés.',
    cycloidalAlt: 'Deux joues cycloïdales fixes encadrent le point de suspension. Le fil orange épouse la joue droite jusqu’au point de contact, puis la quitte tangentiellement en un segment libre rectiligne qui rejoint la masse sur la trajectoire cycloïdale bleue en pointillés.',
    legend: '1 Suspension · 2 Joues cycloïdales fixes · 3 Fil en contact · 4 Fil libre · 5 Masse · 6 Trajectoire de la masse (bleu)',
    caption: 'Le fil a la même longueur totale, 4a, dans les deux dessins. En B, une plus grande longueur de fil s’enroule sur une joue lorsque la masse s’éloigne du point le plus bas, ce qui raccourcit la partie libre. Les joues forment la développée de la trajectoire de la masse ; la masse décrit leur développante, qui est une autre cycloïde. La courbe bleue est la trajectoire réelle de la masse, et non une roue roulant sous le pendule. a est le rayon du cercle qui engendre mathématiquement ces cycloïdes.',
  },
  it: {
    circular: 'A. Pendolo ordinario: un arco di circonferenza', cycloidal: 'B. Pendolo di Huygens: un arco di cicloide',
    circularAlt: 'Un pendolo ordinario è sospeso a un punto fisso mediante un filo rettilineo di lunghezza L = 4a. La massa segue l’arco di circonferenza tratteggiato in blu.',
    cycloidalAlt: 'Due guide cicloidali fisse affiancano il punto di sospensione. Il filo arancione segue la guida destra fino al punto di contatto, poi se ne stacca tangenzialmente come segmento libero rettilineo, che termina nella massa sulla traiettoria cicloidale tratteggiata in blu.',
    legend: '1 Sospensione · 2 Guide cicloidali fisse · 3 Filo a contatto · 4 Filo libero · 5 Massa · 6 Traiettoria della massa (blu)',
    caption: 'Il filo ha la stessa lunghezza totale, 4a, in entrambi i disegni. In B, allontanandosi la massa dal punto più basso, una parte maggiore del filo si avvolge su una guida e il tratto libero si accorcia. Le guide costituiscono l’evoluta della traiettoria della massa; la massa ne descrive l’evolvente, un’altra cicloide. La curva blu è la traiettoria effettiva della massa, non una ruota che rotola sotto il pendolo. a è il raggio della circonferenza che genera matematicamente queste cicloidi.',
  },
  es: {
    circular: 'A. Péndulo ordinario: un arco de circunferencia', cycloidal: 'B. Péndulo de Huygens: un arco de cicloide',
    circularAlt: 'Un péndulo ordinario cuelga de un punto fijo mediante un hilo recto de longitud L = 4a. Su masa sigue el arco de circunferencia azul discontinuo.',
    cycloidalAlt: 'Dos guías cicloidales fijas flanquean el punto de suspensión. El hilo naranja sigue la guía derecha hasta el punto de contacto y después sale tangencialmente como un segmento libre recto que termina en la masa, sobre la trayectoria cicloidal azul discontinua.',
    legend: '1 Suspensión · 2 Guías cicloidales fijas · 3 Hilo en contacto · 4 Hilo libre · 5 Masa · 6 Trayectoria de la masa (azul)',
    caption: 'El hilo tiene la misma longitud total, 4a, en ambos dibujos. En B, cuanto más se aleja la masa del punto más bajo, más hilo se enrolla sobre una guía, acortando el tramo libre. Las guías son la evoluta de la trayectoria de la masa; esta describe su involuta, otra cicloide. La curva azul es la trayectoria real de la masa, no una rueda que ruede bajo el péndulo. a es el radio de la circunferencia que genera matemáticamente estas cicloides.',
  },
  'zh-TW': {
    circular: 'A. 普通單擺：圓弧軌道', cycloidal: 'B. 惠更斯擺：擺線軌道',
    circularAlt: '普通單擺以長度 L＝4a 的直繩懸掛在固定支點上。擺錘沿著藍色虛線圓弧運動。',
    cycloidalAlt: '支點兩側設有固定的擺線形導板。橙色繩索沿右側導板繞至接觸點，再沿切線方向伸出筆直的自由段，末端的擺錘位於藍色虛線所示的擺線軌道上。',
    legend: '1 懸掛點 · 2 固定的擺線形導板 · 3 接觸導板的繩段 · 4 自由繩段 · 5 擺錘 · 6 擺錘軌道（藍色）',
    caption: '兩圖中繩索的總長度皆為 4a。圖 B 中，擺錘離最低點越遠，繞在導板上的繩索就越長，自由段因此縮短。導板是擺錘軌道的漸屈線；擺錘描出的漸伸線也是另一條擺線。藍色曲線是擺錘的實際軌道，並非在擺錘下方滾動的輪子。a 是在數學上生成這些擺線的圓之半徑。',
  },
  ko: {
    circular: 'A. 일반적인 진자: 원호', cycloidal: 'B. 하위헌스의 진자: 사이클로이드 호',
    circularAlt: '일반적인 진자가 길이 L = 4a인 곧은 줄로 고정된 지지점에 매달려 있다. 추는 파란색 점선으로 표시된 원호를 따라 움직인다.',
    cycloidalAlt: '고정된 두 사이클로이드형 안내판이 지지점 양옆에 있다. 주황색 줄은 오른쪽 안내판을 따라 접점까지 감긴 뒤 접선 방향의 곧은 자유 구간으로 이어지며, 끝의 추는 파란색 점선으로 표시된 사이클로이드 경로 위에 있다.',
    legend: '1 지지점 · 2 고정된 사이클로이드형 안내판 · 3 안내판과 접촉하는 줄 · 4 자유롭게 늘어진 줄 · 5 추 · 6 추의 경로(파란색)',
    caption: '두 그림에서 줄의 전체 길이는 모두 4a이다. B에서는 추가 최저점에서 멀어질수록 더 많은 줄이 안내판에 감기므로 자유 구간이 짧아진다. 안내판은 추의 경로에 대한 축폐선이며, 추가 그리는 신개선도 또 다른 사이클로이드이다. 파란 곡선은 추의 실제 경로를 나타내며, 진자 아래에서 바퀴가 굴러가는 장치가 아니다. a는 수학적으로 이 사이클로이드들을 생성하는 원의 반지름이다.',
  },
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
