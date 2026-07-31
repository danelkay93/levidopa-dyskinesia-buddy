# Levodopa Schedule Map

A phone-first, static explorer for repeated Sinemet CR schedules. It is designed for GitHub Pages and has no backend.

## What the chart means

- The blue curve is relative modeled levodopa effect-site exposure.
- `100%` is the modeled peak from one isolated 200 mg Sinemet CR dose under the same model.
- The fill under the curve shows schedule-derived phase prominence:
  - low / OFF context;
  - rising and falling diphasic context;
  - sustained ON / square-wave context;
  - high / peak-dose context.
- Opacity is normalized within each phase for the displayed day. `100%` means the strongest modeled occurrence of that phase in this schedule, not maximal possible dyskinesia or observed symptom severity.
- Candidate phases may overlap, so their colors and patterns can mix.
- Dose markers show nominal CR levodopa milligrams.

The separate colored phase bars, user-set threshold sliders, absorption-profile menu, uncertainty toggle, and amantadine curve were intentionally removed. They occupied scarce phone space while implying more personalization than the available data support.

## Schedule signals

Signals are drawn directly on the plot. Point signals use vertical guides; interval signals use brackets with visible start and end points.

- `↔` close interval: less than 4 hours between CR doses.
- `⋯` long interval: more than 8 hours until the next dose.
- `◆` day high or overlap crest.
- `↗` sharpest rise or an extended rising-transition region.
- `↘` sharpest fall or an extended falling-transition region.
- `○` longest low-exposure stretch.

Tap a signal for its time or interval and the quantity that triggered it. These are schedule-shape observations, not treatment recommendations.

## Model

The deployed app uses a transparent mechanistic model:

1. distributed controlled release over five hours;
2. first-order absorption and elimination;
3. an effect-site compartment for response lag;
4. repetition of the daily schedule across adjacent days;
5. level- and slope-based phase scoring;
6. within-day normalization for each phase.

The default parameters are constrained to the Sinemet CR label's broad pharmacokinetic facts: release over roughly 4–6 hours, mean peak around 2 hours, levodopa half-life around 1.5 hours with carbidopa, and roughly 70–75% relative bioavailability. The model is not fitted to an individual patient.

Python and probabilistic modeling become useful when the project has time-locked observations to fit: actual response latency, bradykinesia, body-region-specific chorea, dystonia, pain, subjective restlessness, meals, and ideally standardized video or sensor measures. Without labeled observations, regression or clustering cannot turn a generic schedule into a patient-specific symptom predictor.

## Why amantadine is absent

Amantadine can reduce the expression of levodopa-induced dyskinesia, particularly peak-dose dyskinesia, but it does not flatten the levodopa absorption curve. Adding its concentration to levodopa or lifting the whole curve by a linear amount is pharmacologically misleading. A later patient-fitted version can test an amantadine modulation term against observations; this version omits it.

## Sharing and privacy

Edited doses stay in browser local storage. **Share this schedule** creates a URL whose query string contains only the four entered dose times and amounts; opening that link recreates the schedule without a database.

GitHub Pages and shared URLs are public. Do not put names, records, symptom diaries, or other identifying medical information in the repository or URL. The default schedule is illustrative.

## Publish with GitHub Pages

1. Open **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select `main` and `/ (root)`.

The site will then be available at `https://danelkay93.github.io/levidopa-dyskinesia-buddy/`.

## Sources informing the model boundary

- [FDA Sinemet CR label](https://www.accessdata.fda.gov/drugsatfda_docs/label/2008/019856s025lbl.pdf)
- [Simon et al. (2016), combined levodopa motor-response and dyskinesia PK/PD model](https://pubmed.ncbi.nlm.nih.gov/26936272/)
- [Suksai et al. (2026), literature-informed PK/PD simulation framework](https://doi.org/10.3389/fphar.2026.1817435)
- [Sawada et al. (2010), randomized amantadine dyskinesia trial](https://doi.org/10.1371/journal.pone.0015298)
- [Pandey and Srivanitchapoom (2017), clinical spectrum of levodopa-induced dyskinesia](https://pmc.ncbi.nlm.nih.gov/articles/PMC5586110/)

## Disclaimer

This is an exploratory schedule model, not measured blood levels, a symptom diagnosis, dosing advice, or a medical device. Medication changes belong with the treating movement-disorders team.
