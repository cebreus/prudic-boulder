# Prudič Boulder

Aplikace je určena pro komunitu boulderistů a nabízí jim nový způsob, jak interaktivně navrhovat a vizualizovat lezecké cesty s použitím LED diod na lezeckých stěnách. Uživatelům umožňuje vytvářet a ukládat unikátní cesty, čímž obohacuje trénink a zábavu v boulderingu.

## 🚀 Struktura projektu

```text
/
├── public/
│   └── favicon.svg
├── src/
│   └── components/
│       ├── atoms/
│       ├── molecules/
│       ├── organisms/
│       └── templates/
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       ├── index.astro
│       ├── new-boulder.astro
│       └── playground.astro
└── package.json
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                | Action                                           |
| :--------------------- | :----------------------------------------------- |
| `pnpm install`         | Installs dependencies                            |
| `pnpm dev`             | Starts local dev server at `localhost:4321`      |
| `pnpm build`           | Build your production site to `./dist/`          |
| `pnpm preview`         | Preview your build locally, before deploying     |
| `pnpm astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `pnpm astro -- --help` | Get help using the Astro CLI                     |
| `pnpm lint`            | Show linting errors                              |
| `pnpm format`          | Fix fixable linting errors                       |

## 👀 Zadání pro vývojáře

Intuitivní a přívětivá aplikace postavená na Svelte a Tailwind CSS v prostředí Astro. Mezi úkoly patří vytváření uživatelského rozhraní pro správu, vytváření a sdílení lezeckých cest, integrace s backendem pro ukládání a mazání dat a vývoj interaktivních funkcí, jako je výběr barvy, nastavení jasu a speciální tlačítka (Top, Start, Save, Show, Clear). Cílem je zajistit uživatelům hladký a intuitivní zážitek při současném dodržování principů modularity a přehlednosti kódu.

### Hlavní úkoly

1. **Vytvoření základních komponent a struktur podle Atomic Design**
   - Rozdělit UI do atomů (tlačítka), molekul (boulder) atp.
   - Implementovat globální stylizaci pomocí Tailwind CSS pro jednotný vzhled a snadnou údržbu.
2. **Implementace routy `/`**
   - Vyvinout komponentu pro zobrazení tabulky uložených cest s možností mazání jednotlivých řádků a dálnle všech cest.
   - Přidat dialog pro náhled uložené cesty.
   - Integrace s API při mazání cest(y).
   - Integrace s API pro načitení cest z API (možnost přidání ke stávajícím nebo nahrazení stávajících).
3. **Implementace route `/new-boulder`**
   - Vytvořit interaktivní tabulku pro definování cest s možností označení startovní a cílové buňky.
   - Implementovat logiku pro ukládání stavu boulderu v rámci aplikace a prohlížeče a nahrání na server.
   - Přidat funkcionalitu pro odeslání dat na server pro fyzické rozsvícení LED diod na lezecké stěně (viz uložení, posílíme na jiný endpoint).
4. **Implementace route `/playground`**
   - Použít komponentu pro definici cest z `/new-boulder` s přidanými funkcemi pro nastavení barvy a jasu LED diod.
   - Vytvořit UI pro color picker a slider pro nastavení jasu.
5. **Globální funkce**
   - **Export a import cest:** Implementovat funkci pro exportování a importování cest, aby uživatelé mohli sdílet nebo zálohovat své cesty.
   - Tlačítko "**Top**" umožní uživateli označit vybranou buňku jako cílový bod cesty, kterého se má lezec dosáhnout. Tím se v aplikaci vytvoří vizuální značka, například změnou barvy nebo přidáním symbolu, která tuto buňku odlišuje jako konečný bod trasy.
   - Podobně jako tlačítko "Top", tlačítko "**Start**" umožní uživatelům označit startovní buňku cesty. Tato buňka bude sloužit jako výchozí bod, odkud mají lezci začít svou cestu na boulderu. Toto označení bude rovněž vizuálně reprezentováno na uživatelském rozhraní.
   - Tlačítko "**Save**" slouží k uložení aktuálně navržené cesty. Po jeho stisknutí se veškeré informace o cestě, včetně umístění startovních a cílových bodů, barvy a jasu LED, uloží a odešlou na server. To umožní uživatelům cesty kdykoliv později načíst a použít.
   - Po stisknutí tlačítka "**Show**" se aktuálně navržená cesta nejen uloží, ale také fyzicky zobrazí na lezecké stěně pomocí LED diod. Server převezme data o cestě a aktivuje LED diody na stěně podle specifikací cesty, což umožní lezcům okamžitě vyzkoušet a prozkoumat navrženou trasu.
   - Tlačítko "**Clear**" slouží k resetování všech aktuálně zvolených buněk v rámci navrhování cesty. Po jeho stisknutí se odstraní veškeré nastavení, včetně označení startovních a cílových bodů, barvy a jasu, což umožní uživateli začít s navrhováním cesty znovu od začátku.

### Technické detaily

- Aplikace musí být co nejúspornější z pohledu velikosti i nároků. Uvažujme, že server je Rapsberry Pi. Aplikace bude primárně používána na mobilech.
- Každá cesta může mít pouze jednu buňku s příznakem "Start" a pouze jednu příznakem "Top". Každá buňka může a současně nemusí mít hodnotu barvy a jasu.
- Rozhodnout se pro vhodný nástroj pro správu stavu, který umožní efektivní aktualizace UI a synchronizaci s backendem.
- Použít fetch API nebo knihovnu pro komunikaci s backendem. Zajistit ošetření chyb a feedback uživateli (dismissable toast).
- Ujistit se, že aplikace je responzivní a přístupná, včetně klávesových zkratek pro snadnější navigaci.
- Píšeme samodokumentující kód a respektujeme metodiky jako je DRY, YAGNI, a KISS.

**Příklad struktury cesty:**

```json
[
	{
		"id": "550e8400",
		"start": "A1",
		"top": "B2",
		"cells": [{ "id": "A1", "colorBrightness": "255 0 0 / 50%" }]
	}
]
```

### Open API specifikace

viz `./openapi.yaml`
