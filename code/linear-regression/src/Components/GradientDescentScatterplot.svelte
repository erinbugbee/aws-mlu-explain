<script>
  import { tweened } from "svelte/motion";
  import { linear } from "svelte/easing";
  import { line } from "d3-shape";
  import { scaleLinear } from "d3-scale";
  import { format } from "d3-format";
  import { gradientDescentData } from "../datasets.js";
  import { max, min } from "d3-array";
  import {
    shuffleIteration,
    gdBias,
    gdWeight,
    gdErrors,
    gdIteration,
    gdError,
  } from "../store.js";

  // set tweened store for line
  const dataset = tweened(
    gradientDescentData.map((d) => {
      return {
        sqft: d[`sqft${$shuffleIteration}`],
        y: $gdBias + $gdWeight * d[`sqft${$shuffleIteration}`],
        price: d[`price${$shuffleIteration}`],
      };
    }),
    {
      duration: 300,
      easing: linear,
    }
  );

  // update line reactively
  $: dataset.set(
    gradientDescentData.map((d) => {
      return {
        sqft: d[`sqft${$shuffleIteration}`],
        y: $gdBias + $gdWeight * d[`sqft${$shuffleIteration}`],
        price: d[`price${$shuffleIteration}`],
      };
    })
  );

  const margin = {
    top: 12,
    bottom: 3,
    left: 40,
    right: 30,
  };

  // these don't matter, but make the stretching less obvious at load
  let height = 500;
  let width = 500;

  // label formatter
  const formatter = format(".2r");

  $: {
    $shuffleIteration;
    // recalculate error if changes
    let errors = gradientDescentData.map((d) => {
      return (
        (d[`price${$shuffleIteration}`] -
          ($gdWeight * d[`sqft${$shuffleIteration}`] + $gdBias)) **
        2
      );
    });
    $gdError = Number(errors.reduce((a, b) => a + b, 0)) / errors.length;
    $gdErrors = [
      ...$gdErrors,
      {
        iteration: $gdIteration,
        error: $gdError,
      },
    ];
  }

  $: {
    $gdBias;
    $gdWeight;
    $gdIteration += 1;
    console.log($gdIteration);
  }

  export function shuffleData() {
    $shuffleIteration = ($shuffleIteration + 1) % 10;
    dataset.set(
      gradientDescentData.map((d) => {
        return {
          sqft: d[`sqft${$shuffleIteration}`],
          y: $gdBias + $gdWeight * d[`sqft${$shuffleIteration}`],
          price: d[`price${$shuffleIteration}`],
        };
      })
    );
    // reset error plot
    $gdIteration = 0;
    $gdErrors = [{ iteration: 0, error: $gdError }];
  }
  export function runGradientDescent(iterations) {
    const N = gradientDescentData.length;
    const learning_rate = 0.001;
    $gdIteration += iterations - 1;
    //   for each iteration
    for (let index = 0; index < iterations; index++) {
      // update error and iterations

      // update the bias term
      let biasDifference = gradientDescentData.map((d) => {
        return (
          d[`price${$shuffleIteration}`] -
          $gdWeight * d[`sqft${$shuffleIteration}`] +
          $gdBias
        );
      });
      let biasSum = Number(
        biasDifference.reduce((a, b) => a + b, 0).toFixed(4)
      );
      $gdError = biasSum / N;
      let b_gradient = (-2 / N) * biasSum;
      const bias = $gdBias + learning_rate * b_gradient;
      $gdBias = Number(bias.toFixed(4));

      // update the bias term
      let weightDifference = gradientDescentData.map((d) => {
        return (
          d[`sqft${$shuffleIteration}`] *
          (d[`price${$shuffleIteration}`] -
            ($gdWeight * d[`sqft${$shuffleIteration}`] + $gdBias))
        );
      });
      let weightSum = Number(
        weightDifference.reduce((a, b) => a + b, 0).toFixed(4)
      );
      let w_gradient = (-2 / N) * weightSum;
      const weight = $gdWeight - learning_rate * w_gradient;
      $gdWeight = Number(weight.toFixed(4));
    }
  }

  // scales
  $: xScale = scaleLinear()
    .domain([
      min($dataset, (d) => d.sqft) - 2,
      max($dataset, (d) => d.sqft) + 2,
      // min(gradientDescentData, (d) => d[`sqft${$shuffleIteration}`]) - 2,
      // max(gradientDescentData, (d) => d[`sqft${$shuffleIteration}`]) + 2,
    ])
    // .domain([0, 11])
    .range([margin.left, width - margin.right]);
  $: yScale = scaleLinear()
    .domain([
      min($dataset, (d) => d.price) - 2,
      max($dataset, (d) => d.price) + 2,
      // min(gradientDescentData, (d) => d[`price${$shuffleIteration}`]),
      // max(gradientDescentData, (d) => d[`price${$shuffleIteration}`]) + 2,
    ])
    // .domain([-1, 16])
    .range([height - margin.bottom, margin.top]);

  // line generator
  $: regressionPath = line()
    .x((d) => xScale(d.sqft))
    .y((d) => yScale(d.y));
</script>

<div id="scatter-chart" bind:offsetWidth={width} bind:offsetHeight={height}>
  <svg {width} height={height + margin.top + margin.bottom}>
    <!-- x-ticks -->
    {#each xScale.ticks() as tick}
      <g transform={`translate(${xScale(tick) + 0} ${height - margin.bottom})`}>
        <!-- svelte-ignore component-name-lowercase -->
        <line
          class="grid-line"
          x1="0"
          x2="0"
          y1="0"
          y2={-height + margin.bottom + margin.top}
          stroke="black"
          stroke-dasharray="4"
        />
        <text class="axis-text" y="15" text-anchor="middle"
          >{formatter(tick)}</text
        >
      </g>
    {/each}
    <!-- y-ticks -->
    {#each yScale.ticks() as tick}
      <g transform={`translate(${margin.left - 5} ${yScale(tick) + 0})`}>
        <!-- svelte-ignore component-name-lowercase -->
        <line
          class="grid-line"
          x1={5}
          x2={width - margin.right}
          y1="0"
          y2="0"
          stroke="black"
          stroke-dasharray="4"
        />
        <text
          class="axis-text"
          y="0"
          text-anchor="end"
          dominant-baseline="middle">{formatter(tick)}</text
        >
      </g>
    {/each}
    <!-- axis lines -->
    <!-- x -->
    <!-- svelte-ignore component-name-lowercase -->
    <line
      class="axis-line"
      y1={height - margin.bottom}
      y2={height - margin.bottom}
      x1={margin.left}
      x2={width}
      stroke="black"
      stroke-width="1"
    />
    <!-- y -->
    <!-- svelte-ignore component-name-lowercase -->
    <line
      class="axis-line"
      y1={margin.top}
      y2={height - margin.bottom}
      x1={margin.left}
      x2={margin.left}
      stroke="black"
      stroke-width="1"
    />
    <!-- axis labels
    <text
      class="axis-label"
      y={height + margin.bottom}
      x={(width + margin.left) / 2}
      text-anchor="middle">Size of House (sqft)</text
    >
    <text
      class="axis-label"
      y={margin.left / 4.8}
      x={-(height / 2)}
      text-anchor="middle"
      transform="rotate(-90)">Housing Price ($)</text
    > -->

    <!-- chart data mappings -->

    <!-- draw regression line -->
    <path class="regression-line" d={regressionPath($dataset)} />

    <!-- draw circles -->
    {#each $dataset as d}
      <circle
        class="regression-circle"
        fill="#c9208a"
        stroke="black"
        stroke-width="1.5"
        r="4.5"
        cx={xScale(d.sqft)}
        cy={yScale(d.price)}
      />
    {/each}
  </svg>
</div>

<style>
  #scatter-chart {
    width: 100%;
    max-height: 98%;
  }

  .regression-circle {
    fill: var(--primary);
    stroke-width: 0;
  }

  .regression-line {
    stroke: var(--squidink);
    stroke-width: 3.5;
    fill: none;
  }

  .axis-label {
    font-weight: bold;
  }

  .axis-text {
    font-size: 0.7rem;
  }

  .error-text {
    text-transform: uppercase;
    font-family: var(--font-heavy);
    stroke-linejoin: round;
    paint-order: stroke fill;
    stroke-width: 4.5px;
    pointer-events: none;
    stroke: #f1f3f3;
    font-size: 0.9rem;
    letter-spacing: 2px;
  }

  .grid-line {
    opacity: 0.075;
  }

  .axis-label {
    text-transform: uppercase;
    font-size: 0.7rem;
  }

  .path-line {
    fill: none;
    stroke-linejoin: round;
    stroke-linecap: round;
    stroke-width: 4;
  }

  /* ipad */
  @media screen and (max-width: 950px) {
    .axis-label {
      font-size: 0.8rem;
    }
    .error-axis-text {
      font-size: 0.8rem;
    }
    .error-text {
      stroke-width: 3.5px;
      stroke: #f1f3f3;
      font-size: 0.8rem;
      letter-spacing: 2px;
    }
  }
  /* mobile */
  @media screen and (max-width: 750px) {
    .axis-label {
      font-size: 0.75rem;
    }
  }
</style>
