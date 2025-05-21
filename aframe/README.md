# AFRAME

### Good to known:

Visual Inspector - CTRL + OPTION + I
https://aframe.io/aframe/examples/
https://aframe.io/docs/1.7.0/components/raycaster.html
view-source:https://aframe.io/aframe/examples/test/raycaster/simple.html
https://aframe.io/docs/1.7.0/core/component.html

### Modely:

https://poly.pizza (low-poly modely)

https://www.mixamo.com (modely postav)

https://gltf-trees.donmccurdy.com (stromy)

## Komentáře

🔧 Best solution: Remap shortcut for block comments
Open IntelliJ IDEA → Preferences (Cmd + ,)
Go to Keymap
In the search bar, type: Comment with Block Comment
Right-click the result → Add Keyboard Shortcut

## Kamera

### Statická

Kamera je fixně umístěna na souřadnicích [x=0, y=3, z=3] a má rotaci -20° okolo osy x (naklonění dolů). Uživatel jejím pohledem nemůže volně hýbat.

```javascript
<!-- Statická kamera ve výšce 3 m, posunutá dozadu a natočená dolů o 20° -->
<a-entity camera position="0 3 3" rotation="-20 0 0"></a-entity>
```

### Ovládaná uživatelem (POV)

Pro první osobu (First-Person View) se používá prvek `<a-camera>` nebo `<a-entity camera>` spolu s ovládacími komponentami. Nejčastěji `look-controls` (umožňuje rozhlížení myší či headsetem) a `wasd-controls` (pohyb pomocí kláves WASD/šipek). Příklad:

Kamera je ve výšce ~1.6 m (typická výška očí). `look-controls` zajistí rozhlížení (např. myší na desktopu nebo otáčením hlavy ve VR). `wasd-controls` přidává posun kamerou pomocí kláves (parametr `acceleration` udává rychlost pohybu, výchozí je 40). Uživatel tak může volně chodit po scéně a rozhlížet se.

```javascript
<!-- Kamera ovládaná uživatelem: pohled z výšky 1.6 m, ovládání myší a klávesnicí -->
<a-camera position="0 1.6 0" look-controls wasd-controls="acceleration: 20">
  <!-- případně vnořené prvky, např. ruce, zbraň atd. -->
</a-camera>
```

### Přepínání kamer

A-Frame umožňuje mít ve scéně více kamer, z nichž vždy jen jedna je aktivní. Každá kamera má atribut `active` (výchozí true). Pro přepnutí kamery musíme nastavit u nové kamery `active: true` a současně ostatním kamerám nastavit `active: false` (to se provede automaticky). Typicky se kamery přepínají pomocí skriptu:

Příklad: přepnutí na kameru s `id="secondCamera"`

```javascript
const newCam = document.querySelector("#secondCamera");
newCam.setAttribute("camera", "active", true); // tato kamera se stane aktivní
```

Při volání výše uvedeného kódu se kamera s identifikátorem `secondCamera` stane aktuální. A-Frame zajistí, že původní kamera přestane být aktivní. Tento mechanismus lze využít např. pro přepínání mezi pohledem první osoby (z kamery na avataru) a pohledem třetí osoby (např. statická kamera sledující scénu shora).

### Žádná definovaná kamera

Pokud ve scéně žádnou kameru nedefinujeme, A-Frame vytvoří automaticky výchozí kameru s komponentami `look-controls` a `wasd-controls` umístěnou v `[0 1.6 0]` . V praxi je však lepší si kamery definovat explicitně podle potřeb aplikace.

## Práce s 3D modely

Budeme používat hlavně GLB (binární glTF) modely ale pro jiné to funguje stejně.
V A-Frame se používá komponenta gltf-model. Postup je podobný:

```javascript
<a-assets>
  <a-asset-item id="treeModel" src="models/tree.gltf"></a-asset-item>
</a-assets>
<!-- Vložení glTF modelu do scény -->
<a-entity gltf-model="#treeModel" position="0 0 -5" rotation="0 45 0"></a-entity>
```

Do assetů je nahrán model stromu `tree.gltf` s ID `treeModel`. Ve scéně se pak vloží entita s atributem `gltf-model`, který odkazuje na daný asset. Strom je umístěn 5 metrů před kamerou (osa -z) a pootočen o 45° kolem osy y. U glTF není třeba samostatný materiálový soubor; veškeré textury a materiály mohou být obsaženy přímo ve formátu.

Při vkládání modelů je často potřeba je správně zmenšit či zvětšit (`scale`) a nastavit polohu. Souřadný systém A-Frame: osa X jde zprava doleva, Y směřuje vzhůru, Z jde směrem od kamery do scény (tj. negativní Z je dopředu před kameru). Jednotky délky odpovídají metrům. Pokud model neodpovídá orientací očekávanému směru, lze ho otočit pomocí atributu rotation (v stupních kolem os x, y, z). Například u humanoidních modelů glTF bývá potřeba je pootočit, aby „čelily“ směrem ke kameře nebo dle osy pohybu.

## Animace objektů

### Deklarativní animace vlastností

A-Frame obsahuje komponentu `animation`, kterou lze přidat jako atribut entitě. Umožňuje animovat změnu jedné vlastnosti z výchozí hodnoty na cílovou. Lze nastavit délku trvání (`dur` v ms), `easings` (způsob průběhu animace), opakování (`loop`) atd. Příklad jednoduché animace rotace:

```javascript
<!-- Krychle rotující kolem Y osy dokola -->
<a-box color="orange" position="0 1 -3"
       animation="property: rotation; to: 0 360 0; loop: true; dur: 5000">
</a-box>
```

Oranžová kostka umístěná před kamerou (1 m nad zemí, 3 m před) se neustále otáčí kolem svislé osy. Atribut `animation` nastavuje animaci: `property: rotatio` znamená, že animujeme rotaci objektu; `to: 0 360 0` udává cílovou rotaci (o 360° kolem osy Y); `loop: true` zajistí nekonečné opakování a `dur: 5000` nastavuje dobu jedné otočky na 5000 ms (5 sekund). Podobně můžeme animovat i jiné vlastnosti, např. pozici (`property: position; to: x y z`), měřítko či barvu materiálu (`property: material.color; to: #FF0000` pro plynulé změny barvy).

### Složitější animace a více animací

Pro složitější scénáře lze použít více animací na jednom objektu – v A-Frame jim můžeme dát pojmenované sloty. Například:

```javascript
<a-sphere
  color="#24CAFF"
  position="0 1 -4"
  radius="1"
  animation__scale="property: scale; to: 2 2 2; dir: alternate; dur: 1000; loop: true"
  animation__rotate="property: rotation; to: 0 360 0; dur: 2000; loop: true"
></a-sphere>
```

Světle modrá koule před kamerou periodicky pulsuje (střídavě zvětšuje a zmenšuje se, `dir: alternate`) a zároveň se otáčí. Pomocí dvou animací s odlišnými názvy (`animation__scale`, `animation__rotate`) lze nezávisle animovat více vlastností zároveň.

### Animace modelů

Pokud importovaný 3D model (např. glTF/glb) obsahuje animace kostry nebo předem připravené klipy, využijeme komponentu animation-mixer. Ta přehrává animace obsažené v modelu. Je potřeba uvést, jaký klip chceme spustit (pokud model obsahuje pojmenované animace). Příklad:

```javascript
<a-entity
  gltf-model="#robot"
  position="0 0 -5"
  animation-mixer="clip: wave; loop: once; crossFadeDuration: 0.5"
></a-entity>
```

Entita s 3D modelem robota spustí animaci s názvem `wave` (mávání rukou, apod.). Animace se nebude opakovat (`loop: once`) a při přechodu mezi animacemi se použije půlsekundové plynulé prolínání (`crossFadeDuration: 0.5`). Komponenta `animation-mixer` interně využívá knihovnu `three.js` a její `AnimationMixer`. Pokud není uveden žádný klip, automaticky se spustí první animace modelu. Lze také přehrávat více animací současně (voláním `el.setAttribute('animation-mixer', 'clip: jinýKlip')` v různých okamžicích, jako je to řešené v přiloženém projektu).

### Řízení animace skriptem

Kromě deklarativních možností můžeme animace spouštět, zastavovat či měnit i skriptově. V přiloženém projektu se např. při stisku kláves mění aktuální animační klip postavy z idle (postávání) na run (běh) a naopak pomocí `el.setAttribute('animation-mixer', {clip: 'run'})`. Dynamické spouštění animací umožňuje reagovat na vstup uživatele nebo jiné události ve hře.

## Základy fyziky

ro simulaci fyzikálních jevů (gravitační pád, kolize, setrvačnost) je v A-Frame k dispozici rozšiřující physics system. Populární je plugin `aframe-physics-system`, který využívá fyzikální engine `Cannon.js`. Tento systém přidává do A-Frame komponenty jako `dynamic-body`, `static-bod`y aj., které umožňují fyzikální chování entit.

### Zahrnutí fyziky

Pokud projekt využívá modulární bundler (jako zde Vite), stačí importovat balíček `aframe-physics-system`. V HTML projektu lze alternativně přidat CDN skript, např.:

```javascript
<script src="https://cdn.jsdelivr.net/npm/aframe-physics-system@4.0.1/dist/aframe-physics-system.min.js"></script>
```

### Dynamic-body vs Static-body

Komponenta `dynamic-body` označuje entitu, která se bude řídit fyzikou (má hmotnost, reaguje na síly, gravitaci, kolize). Oproti tomu `static-body` je určena pro nehybné objekty (scénu, podlahu, stěny, velké překážky) – ty se v simulaci nepohybují, ale mohou do nich narazit dynamická tělesa. Typicky všechny pohyblivé objekty (hráč, projektily, pohyblivé překážky) mají `dynamic-body`, zatímco terén a statické překážky `static-body`. Příklad:

```javascript
<!-- Země jako statické těleso (nekonečná rovina) -->
<a-plane static-body rotation="-90 0 0" width="100" height="100" color="#7CFC00"></a-plane>

<!-- Padající krychle jako dynamické těleso -->
<a-box dynamic-body="mass: 5; shape: box;" position="0 10 -5" color="red"></a-box>
```

Rovná plocha (plane) je nastavena jako statické těleso – představuje nehybnou podlahu. Červená kostka je dynamické těleso s hmotností 5 (kg) a tvarem box (kvádr). Díky gravitaci (implicitně nastavena na ~9.8 m/s² směrem dolů) začne kostka padat na zem. Při dopadu dojde ke kolizi a kostka se zastaví na ploše (nebo se odrazí dle nastavení).

### Vlastnosti těles

Atributy `dynamic-body` a `static-body` umožňují upřesnit chování. Kromě `mass` (hmotnost) lze nastavit např. `friction` (tření) a `restitution` (pružnost – odrazivost).
Dále je možné specifikovat shape (tvar kolizního tělesa): box, sphere, cylinder apod., pokud výchozí automaticky odvozený tvar nevyhovuje.

## Kinematika

Kromě statických a dynamických existují i kinematické (komponenta `kinematic-body`). Ta se hodí pro objekty, které se pohybují podle předem daných trajektorií či uživatelského vstupu, ale zároveň ovlivňují dynamická tělesa kolizemi. Kinematické objekty ignorují síly fyziky (gravitačně nepadají), pohyb jim řídíme skriptem, ale při nárazech mohou odsunout jiné objekty. (V tomto projektu nebylo potřeba, ale je to užitečné např. pro pohybující se plošiny).

## Události kolizí

Při použití fyzikálního systému se při střetech generují události. Každá entita s dynamic-body spouští událost collide v okamžiku nárazu do jiného tělesa. Tuto událost můžeme zachytit a reagovat na ni ve vlastních komponentech:

Uvnitř komponenty nebo skriptu:

```javascript
el.addEventListener("collide", (event) => {
  const otherObj = event.detail.body; // fyzikální těleso, se kterým došlo ke kolizi
  const impactForce = event.detail.contact; // informace o kontaktu (síla, bod zásahu)
  console.log("Kolize s objektem:", otherObj.el); // odkaz na A-Frame entitu protějšího objektu
});
```

Při kolizi elementu el (na kterém je nasloucháno) s jiným tělesem je volán handler. Z objektu `event.detail.body` můžeme získat např. `otherObj.el` – tj. DOM element protějšího objektu, se kterým jsme se srazili. Můžeme tak podmíněně reagovat jen na určité typy objektů (např. porovnat ID nebo třídu, či zjistit, zda má atribut obstacle apod.).

Pro pohyb postavy se nastavuje vlastnost velocity u těla (aby se nezastavila třením) a při kolizi s překážkou se snižuje zdraví hráče a vyšle se vlastní událost o srážce (collide-with-character). To ukazuje, že nadstavbou nad základními kolizními událostmi můžeme definovat vlastní logiku hry.

## Práce se světlem

### Ambientní

Osvětluje celou scénu rovnoměrně ze všech směrů. Nemá konkrétní směr ani pozici, ovlivňuje všechny objekty stejně. Využívá se k naznačení základního osvětlení prostředí. Příklad: slabé ambientní světlo bílé barvy:

```javascript
<a-entity light="type: ambient; color: #FFFFFF; intensity: 0.2"></a-entity>
```

Intenzita 0.2 je relativně nízká – objekty získají jemné obecné osvětlení, aby úplně nezčernaly ve stínech. Ambientní světlo nevrhá stíny (nedá se určit směr stínu).

### Směrové

Představuje vzdálený zdroj světla, který svítí jedním směrem (analogicky ke slunci). Paprsky jsou rovnoběžné. Má pozici a směr (daný orientací entity), ale jeho pozici lze chápat spíše jako nekonečně vzdálenou – pouze směr je podstatný. Umí vrhat stíny. Příklad: měkké směrové světlo imitující slunce:

```javascript
<a-entity
  light="type: directional; color: #fff; intensity: 0.5; castShadow: true"
  position="0 10 -5"
  rotation="-45 0 0"
></a-entity>
```

Světlo je umístěno nad scénou a mírně před ní `(position="0 10 -5")` a nasměrováno dolů pod úhlem 45°. Atribut `castShadow: true` zajistí, že objekty blokující toto světlo vrhají stíny. (Pozn.: Pro stíny je třeba povolit stín i u objektů: např. `shadow="receive: true"` u podlahy a `shadow="cast: true"` u objektů, které mají stín vrhat.)

### Bodové

Světelný zdroj vyzařující do všech směrů z jednoho bodu (jako žárovka). Má pozici, ale žádný směr (svítí sféricky). Intenzita se může s vzdáleností snižovat (parametry rozpadu jsou interně nastaveny). Příklad: bodové světlo na lampě:

```javascript
<a-entity
  light="type: point; intensity: 1; distance: 15; color: #ffa500"
  position="2 4 -3"
></a-entity>
```

Oranžové světlo (barva `#ffa500`) je umístěno na souřadnicích `[2,4,-3]`. Parametr `distance: 15` může omezit dosah světla (po 15 metrech už nebude mít vliv). Bodové světlo může vrhat stíny (castShadow), ale v A-Frame/Three.js je potřeba opatrnost s výkonem při více bodových světlech.

### Reflektor

Kuželové světlo vycházející z bodu určitým směrem – podobně jako baterka nebo reflektor. Kromě pozice je důležitá orientace (rotace entity určuje směr kuželu) a úhel kužele (`angle`). Lze nastavit i okraj kužele (penumbra). Příklad: reflektor připevněný na pohyblivé postavě:

```javascript
<a-entity
  light="type: spot; color: #fff; intensity: 2; angle: 45; penumbra: 0.1; castShadow: true"
  position="0 3 0"
  rotation="-90 0 0"
></a-entity>
```

Tento reflektor svítí směrem dolů (rotační složka `-90 0 0` – naklonění o 90° kolem osy X). Kužel má poloviční úhel 45° a mírně rozptýlené okraje `penumbra: 0.1`). Intenzita je vyšší (`2`), takže osvětlí výrazně oblast pod sebou. Opět `castShadow: true` umožní tvorbu stínů.

### Polokruhové

Zvláštní typ ambientního světla, které simuluje oblohu a zem – svítí shora jednou barvou a zdola druhou. Vytváří efekt, že horní plochy objektů mají jiný nádech než spodní (např. modravé světlo z nebe vs. odraz od země). Příklad použití:

```javascript
<a-entity light="type: hemisphere; skyColor: #cef; groundColor: #a95; intensity: 0.6"></a-entity>
```

Obloha dává namodralé světlo (skyColor) a země teplejší odraz (groundColor). Intenzita 0.6 zajistí znatelné smíšené osvětlení. Hemisphere light nevrhá stíny (podobně jako ambient).

## Ovládání objektů pomocí klávesnice

nterakce pomocí kláves umožňuje ovládat pohyb postav nebo jiných objektů. A-Frame poskytuje základní ovládání pro kameru (viz wasd-controls výše), ale pro vlastní objekty nebo specifické chování si obvykle vytvoříme komponentu, která bude naslouchat událostem klávesnice.

### Zachytávání kláves

V prostředí prohlížeče můžeme poslouchat události keydown (stisk klávesy) a keyup (uvolnění klávesy) na objektu document nebo window. V komponentě A-Frame to uděláme v metodě `init()`. Příklad jednoduché komponenty pro pohyb entity pomocí šipek:

```javascript
AFRAME.registerComponent("movable", {
  init: function () {
    // Při stisku kláves nastavíme směr pohybu
    document.addEventListener("keydown", (event) => {
      if (event.key === "ArrowUp") {
        this.direction = "up";
      } else if (event.key === "ArrowDown") {
        this.direction = "down";
      } else if (event.key === "ArrowLeft") {
        this.direction = "left";
      } else if (event.key === "ArrowRight") {
        this.direction = "right";
      }
    });
    // Při uvolnění klávesy zastavíme pohyb
    document.addEventListener("keyup", () => {
      this.direction = null;
    });
  },
  tick: function (time, timeDelta) {
    // Každý frame posuneme objekt podle aktuálního směru
    if (!this.direction) return;
    const moveDistance = 0.05 * (timeDelta / 16); // rychlost, normalizováno na 60fps
    let pos = this.el.getAttribute("position");
    if (this.direction === "up") {
      pos.z -= moveDistance;
    }
    if (this.direction === "down") {
      pos.z += moveDistance;
    }
    if (this.direction === "left") {
      pos.x -= moveDistance;
    }
    if (this.direction === "right") {
      pos.x += moveDistance;
    }
    this.el.setAttribute("position", pos);
  },
});
```

Komponenta movable reaguje na šipky. V init si nastaví event listenery na dokument. Když uživatel drží např. šipku nahoru, nastaví se směr pohybu `this.direction = 'up'`. Při uvolnění klávesy se směr vynuluje (null). Metoda tick se volá každframe (typicky ~60× za sekundu) a pokud je nastaven směr, posune entitu o kousek daným směrem. Posun moveDistance je odvozen z timeDelta – zajistí konzistentní rychlost i při různých FPS. Používáme `getAttribute('position')` k získání aktuální pozice a potom ji upravíme a nastavíme zpět pomocí setAttribute. Tímto způsobem se objekt bude plynule pohybovat, dokud uživatel drží klávesu.

Obdobný princip použit pro pohyb hráčovy postavy. Tam se však místo přímého nastavování pozice využívá fyzikální `velocity` (protože postava je fyzikální objekt). Při stisku kláves se nastaví směr (ve vektoru `CANNON.Vec3`) a v každém tick se upraví `this.el.body.velocity` – což je přímo rychlost tělesa v `Cannon.js`. To zajistí, že postava se bude pohybovat daným směrem, ale bude stále podléhat fyzikálním silám (tření, gravitace). Při uvolnění klávesy se rychlost vynuluje a díky tření se postava postupně zastaví.

## Práce s objekty a dynamické změny

Každá entita v A-Frame má atributy (odpovídající komponentám), které definují její vlastnosti – například `polohu (position), materiál (material), geometrii (geometry) a další`. Tyto vlastnosti lze kdykoliv dynamicky číst a měnit prostřednictvím JavaScriptu. Dále si můžeme v komponentách definovat proměnné (stav), které uchovávají stav objektu (např. zdraví postavy) a s těmito proměnnými pracovat.

### Čtení a nastavování atributů

A-Frame poskytuje metody `el.getAttribute(name)` a `el.setAttribute(name, value)` pro získání a nastavení atributů. Příklad: změníme barvu a pozici objektu během běhu aplikace:

```javascript
let boxEl = document.querySelector("#myBox");
// Změna barvy na modrou
boxEl.setAttribute("material", "color", "#0000FF");
// Posunutí objektu o 1 jednotku vpravo (osa X)
let pos = boxEl.getAttribute("position"); // např. {x: 0, y: 1, z: -5}
pos.x += 1;
boxEl.setAttribute("position", pos);
```

Nejprve získáme odkaz na entitu (např.` <a-box id="myBox">`). Metodou `setAttribute` s parametry (komponenta, vlastnost, hodnota) změníme barvu materiálu na modrou. Poté si uložíme aktuální pozici objektu pos a zvýšíme x o 1. Aktualizovanou pozici opět nastavíme. Objekty se v A-Frame pohybují plynule – pokud tuto změnu uděláme v nějaké smyčce (např. v tick), můžeme tím objekt kontinuálně posouvat.

### Komponenty a jejich data

U vlastních komponent definujeme schema – tj. jaké vlastnosti (proměnné) komponenta má. Například komponenta obstacle v projektu má schema s atributem strength (odolnost překážky):

```javascript
AFRAME.registerComponent("obstacle", {
  schema: {
    strength: { type: "int", default: 100 },
  },
  init: function () {
    console.log("Obstacle created, strength =", this.data.strength);
  },
  // ...
});
```

Atribut strength lze pak nastavit v HTML tagu: `<a-entity obstacle="strength: 150">`. Uvnitř kódu komponenty k němu přistupujeme přes `this.data.strength` (framework tam uloží naparsovanou hodnotu). Proměnné definované takto v schema lze dynamicky měnit také přes setAttribute obdobně jako u vestavěných komponent.

### Vnitřní stav a proměnné

Kromě dat v schema můžeme v komponentě používat libovolné vlastní proměnné (např. `this.health`, `this.direction`, atd.), které drží aktuální stav objektu, ale nejsou přímo vystaveny jako atribut. Tyto proměnné můžeme upravovat v kódu komponenty. Pokud však chceme, aby byly viditelné i zvenčí (např. aby šly nastavit z HTML), je lepší je dát do schema.

### Dynamiocké vytváření a rušení entit

Mimo změnu atributů existuje i možnost přidávat či odebírat celé objekty za běhu. Lze použít `DOM API`, např. `sceneEl.appendChild(novaEntita)` pro přidání nové `<a-entity>` nebo `entita.parentNode.removeChild(entita` pro odstranění. A-Frame také nabízí `el.remove()` pro odstranění entity. V projektu je toto vidět: pokud překážka obdrží dost zásahů, zavolá `this.el.remove()` (s malým zpožděním) a objekt je odstraněn ze scény i z fyzikální simulace.

### Příklad

Změna vlastnosti při interakci: Uvažujme, že chceme, aby se objekt při najetí kurzoru zbarvil zeleně. Můžeme využít vestavěné události A-Frame (mouseenter, mouseleave):

```javascript
<a-box id="interaktivniBox" color="red" position="0 2 -3"></a-box>
<script>
  let box = document.querySelector('#interaktivniBox');
  box.addEventListener('mouseenter', () => {
    box.setAttribute('color', 'green');  // změní barvu na zelenou při najetí myší
  });
  box.addEventListener('mouseleave', () => {
    box.setAttribute('color', 'red');    // vrátí barvu na červenou při odjetí
  });
</script>
```

Tato ukázka využívá dynamickou změnu atributu materiálu (color) na základě událostí. Podobně bychom mohli měnit libovolné jiné vlastnosti objektu (např. spustit animaci, změnit texturu apod.) při nastání určité situace ve hře.

## Detekce kolizí a reakce na ně

Detekce kolizí je klíčová pro interakce ve hrách a simulacích – například když postava narazí do překážky, sebere objekt nebo střela zasáhne cíl. V A-Frame lze kolize detekovat několika způsoby:

### Fyzikální kolize

Fyzikální engine (`aframe-physics-system`) vyvolává událost `collide` při skutečném fyzikálním střetu dvou těles. To je vhodné pro objekty, které mají `dynamic-body` nebo `static-body`. Reakci pak naprogramujeme v obsluze této události. Např. v projektu komponenta character naslouchá na své entitě události collide – když detekuje kolizi s objektem, který má komponentu obstacle, sníží zdraví hráče a vyšle událost `collide-with-character` pro danou překážku:

Uvnitř komponenty `character.js` (pseudokód vycházející z projektu):

```javascript
this.el.addEventListener("collide", (event) => {
  const otherBody = event.detail.body;
  if (otherBody.el.hasAttribute("obstacle")) {
    this.health -= 40; // sníží zdraví postavy
    otherBody.el.emit("collide-with-character"); // upozorní překážku na srážku
  }
});
```

Tato logika zajišťuje, že při nárazu do obstacle (překážky) se postavě odečte zdraví. Pokud klesne na nulu, hra zobrazí "Game Over" (v projektu se pak zobrazí skrytý `<div id="game-over">You lost!</div>` nastavením stylu). Zároveň postava vyšle vlastní událost `collide-with-character`, na kterou reaguje komponenta obstacle u překážky – ta např. zvýší počítadlo zásahů a při překročení určité hodnoty sama sebe odstraní ze scény (`this.el.remove()`), což simuluje zničení překážky.

### Raycasting (paprsek)

Další metoda detekce kolize či spíše přiblížení/viditelnosti je pomocí raycasteru – virtuálního paprsku, který můžeme vyslat určitým směrem a zjistit, zda narazí na nějaký objekt. V A-Frame je komponenta raycaster, kterou lze nasadit na entitu (často na kameru nebo na ovladač). Raycaster umí generovat události raycaster-intersection (paprsek se právě dotkl objektu) a raycaster-intersection-cleared (paprsek přestal objekt zasahovat). Tato metoda je užitečná např. pro detekci, kam se hráč dívá (highlight objektu pod kurzorem nebo před zaměřovačem) nebo pro předběžnou detekci kolize před tím, než k ní fyzicky dojde. Příklad: Mějme paprsek připevněný ke kameře, který míří před hráče:

```javascript
<a-entity id="cameraRig" position="0 1.6 0">
  <a-camera look-controls></a-camera>
  <!-- Paprsek z kamery dopředu pro detekci překážek -->
  <a-entity raycaster="objects: .obstacle; far: 5"
            rotation="0 0 0" position="0 0 0"
            collider-check></a-entity>
</a-entity>

```

Komponenta `collider-check` (podobná jako v projektu):

```javascript
AFRAME.registerComponent("collider-check", {
  dependencies: ["raycaster"],
  init: function () {
    this.el.addEventListener("raycaster-intersection", (evt) => {
      const hitEls = evt.detail.els;
      console.log("Ray hit these entities: ", hitEls);
      // Můžeme např. změnit barvu prvního zasaženého objektu:
      if (hitEls[0]) {
        hitEls[0].setAttribute("material", "color", "yellow");
      }
    });
  },
});
```

Zde raycaster prohledává objekty s třídou .obstacle do vzdálenosti 5 metrů před sebou. Když dojde k zásahu, komponenta collider-check vypíše, které entity paprsek zasáhl, a u první zasažené objektu změní barvu na žlutou. Tím lze například upozornit hráče na překážku, ke které se blíží, ještě než do ní narazí fyzicky. Pozor: Raycaster pracuje na úrovni vykreslování (Three.js) – detekuje průnik paprsku s geometrií objektu, nikoli fyzikální těleso.

### Reakce na kolize

akmile kolizi detekujeme, můžeme provést libovolnou akci dle potřeb aplikace/hry:

- Pohyb/odraz: Můžeme změnit směr pohybu objektu (např. jednoduše invertovat jeho směr pro odraz od stěny) nebo aplikovat sílu. Pokud využíváme `physics-system`, můžeme např. upravit `velocity` nebo - použít `this.el.body.applyImpulse(...)` pro fyzikálně věrný odraz.
- Změna barvy nebo jiných vlastností: Kolize může vyvolat vizuální efekt – změnu barvy zasaženého objektu, zablikání, přehrání animace (např. objekt se zatřese).
- Smazání objektu: Jak ukazuje projekt, typickým použitím je odstranění objektu po několika zásazích (např. cíl zmizí nebo se rozpadne). Pomocí `el.remove()` můžeme objekt z DOMu odebrat. Případně lze nastavit atribut `visible: false` pro prosté skrytí.
- Spuštění zvuku: A-Frame má komponentu sound, takže na kolizi můžeme reagovat přehráním zvuku (`el.components.sound.playSound()`).
- Další herní logika: Např. zvýšení skóre, snížení zdraví (jako v projektu – když zdraví klesne na nulu, vyvolá se game over), vytvoření nového objektu (např. exploze).
