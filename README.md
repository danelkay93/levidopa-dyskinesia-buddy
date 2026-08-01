# Levodopa Day Map

A phone-first, static explorer for a repeated Sinemet CR schedule. It runs entirely in the browser and is designed for GitHub Pages.

## What the graph shows

- The thick curve is relative modeled levodopa effect-site exposure.
- `100%` is the modeled peak from one isolated 200 mg Sinemet CR tablet under the same model.
- Red portions of the curve are the schedule's low/OFF-shaped regions.
- Amber portions mark fast rising or falling transition-shaped stretches. The graph emphasizes the whole stretch rather than reporting an isolated maximum derivative.
- Faint dashed curves show how the day's individual doses contribute to the total. Tap a pill to highlight one contribution.
- Dose markers use a full rounded tablet for 200 mg and a visibly halved tablet shape for 100 mg, with the dose and time attached to the same guide.
- Curly braces show the no-dose time between daytime doses. An hourglass accompanies the duration; a warning mark and amber color identify spacing shorter than four hours.
- The day high, quickest climb, and quickest drop are point markers below the time axis, connected to the curve by dotted guides.
- Morning and overnight low sections are displayed separately as `OFF for …`, so a low period that wraps across the chart boundary remains understandable.

The fill under the curve uses a stable color and pattern for four schedule-derived contexts:

- OFF / low;
- changing level, rising or falling;
- steady ON / square-wave context;
- high / peak-dose context.

Opacity is normalized within each context for the displayed day. Deeper fill means a stronger relative signal in this schedule—not measured symptom severity, probability, or confidence. Contexts can overlap, so their fills can mix.

## Practical zero

An exponential pharmacokinetic tail never mathematically reaches zero. That is visually unhelpful once the residual has become negligible. The display therefore maps values at or below 8% of the isolated full-tablet reference to zero, then continuously rescales higher values so the full-tablet reference remains 100%.

Individual dose contributions are rescaled proportionally at each time point, so they still add back up to the displayed total. The 8% floor is a display convention, not a biological OFF threshold.

## Model boundary

The app uses a transparent deterministic model:

1. distributed controlled release over five hours;
2. first-order absorption and elimination;
3. an effect-site compartment for response lag;
4. repetition of the schedule across adjacent days;
5. a practical-zero display transform;
6. level- and slope-based context scoring.

The parameters are constrained to broad Sinemet CR label properties: release over roughly 4–6 hours, mean peak around two hours, levodopa half-life around 1.5 hours with carbidopa, and about 70–75% relative bioavailability. The current model is not fitted to an individual patient.

There is no validated levodopa-slope cutoff at which diphasic dyskinesia becomes likely. The amber transition heuristic therefore combines speed relative to the isolated full-dose reference with residence in an intermediate-level band. It identifies a schedule feature worth inspecting; it does not claim a clinical risk threshold.

Python would not make this generic deterministic curve inherently more accurate. Python becomes useful later for fitting time-locked observations—response latency, bradykinesia, anatomy-specific chorea, dystonia, pain, meals, video, or sensor measures—to patient-specific parameters or a state model. The browser can run the present mathematics exactly and privately.

## Why amantadine is absent

Amantadine can reduce the expression of levodopa-induced dyskinesia, particularly peak-dose dyskinesia, but it does not flatten the levodopa pharmacokinetic curve. Adding its concentration to levodopa or lifting the whole curve would imply a quantitative relationship this version cannot support. A later observation-fitted model could test an amantadine modulation term separately.

## Sharing and privacy

Edited doses stay in browser local storage. **Share schedule** creates a URL whose query string contains only the four dose times and amounts; opening the link recreates the schedule without a database.

GitHub Pages and shared URLs are public. Do not place names, records, symptom diaries, or identifying medical information in the repository or URL.

## Sources informing the model boundary

- [FDA Sinemet CR label, 2026](https://www.accessdata.fda.gov/drugsatfda_docs/label/2026/019856s029lbl.pdf)
- [Adamiak et al. (2010), levodopa PK/PD modeling in advanced Parkinson disease](https://pubmed.ncbi.nlm.nih.gov/20216409/)
- [Simon et al. (2016), combined motor-response and dyskinesia PK/PD model](https://pubmed.ncbi.nlm.nih.gov/26936272/)
- [Stocchi et al. (2005), intermittent versus continuous levodopa administration](https://jamanetwork.com/journals/jamaneurology/fullarticle/788691)
- [Suksai et al. (2026), literature-informed PK/PD simulation framework](https://doi.org/10.3389/fphar.2026.1817435)
- [Pandey and Srivanitchapoom (2017), clinical spectrum of levodopa-induced dyskinesia](https://pmc.ncbi.nlm.nih.gov/articles/PMC5586110/)

## Disclaimer

This is an exploratory schedule-shape model, not measured blood levels, a symptom diagnosis, dosing advice, or a medical device. Medication changes belong with the treating movement-disorders team.
