<script>
  import { gdBias, gdWeight } from "../store";
  import katexify from "../katexify";
  import GradientDescentScatterplot from "./GradientDescentScatterplot.svelte";
  import GradientDescentErrorPlot from "./GradientDescentErrorPlot.svelte";
  import Hidden from "./Hidden.svelte";
  import { tooltip } from "../tooltip";

  // instantiate class for gd methods
  let gdScatterClass;
  let gdErrorClass;
  let shown;
  let show;
</script>

<h1 class="body-header">Learning The Coefficients</h1>
<p class="body-text">
  <br />
  Let's recap what we've learned so far: Linear regression is all about finding a
  line (or surface) that fits our data well. And as we just saw, this involves selecting
  the coefficients of our model that minimize our evaluation metric. But how can
  we best estimate these coefficients? In practice, they're unknown, and selecting
  them by hand quickly becomes infeasible for regression models with many features.
  There must be a better way!
  <br /><br />
  Luckily for us, several algorithms exist to do just this. We'll discuss two: an
  iterative solution (gradient descent) and a closed-form solution (least squares).
  <br /><br />
  <span class="bold">Gradient Descent</span>
  <br />
  Gradient descent is an iterative optimization algorithm that estimates some set
  of coefficients to yield the minimum of a convex function. Put simply: it will
  find suitable coefficients for our regression model that minimize prediction error
  (remember, lower MSE equals better model).
  <br /><br />
  A full conversation on gradient descent is outside the course of this article (stay-tuned
  for our future article on the subject), but if you'd like to learn more, click
  the "Show Math" button below. Otherwise, read on!
  <br />
</p>
<div class="show-button-container">
  <button class="show-button" on:click={show}
    >{shown ? `Hide` : `Show`} Math</button
  >
</div>

<Hidden bind:shown bind:show>
  <section class="gd-math">
    <p class="body-text">
      Gradient descent works as follows. We assume that we have some convex
      function representing the error of our machine learning algorithm (in our
      case, MSE). Gradient descent will iteratively update our model's
      coefficients in the direction of our error functions minimum <span
        class="info-tooltip"
        title="Gradient descent won't always yield the best coefficients for our model, because it can sometimes 
    get stuck in local minima (as opposed to global minima). Many extensions exist to help solve this problem."
        use:tooltip
      >
        [&#8505;]
      </span>.
      <br /><br />
      In our case, our model takes the form:
      {@html katexify(
        `\\begin{aligned} \\hat{y}=\\hat{\\beta_0} + \\hat{\\beta_1}x_1  \\end{aligned}`,
        true
      )}
      and our error function takes the form:
      {@html katexify(
        `\\begin{aligned} MSE(\\hat{\\beta_0}, \\hat{\\beta_1}) = \\frac{1}{n} \\sum^{n}_{i=1}(y_i - \\hat{y_i})^2 \\\\
        = \\frac{1}{n} \\sum^{n}_{i=1}(y_i - (\\hat{\\beta_0} + \\hat{\\beta_1}x_1 ))^2 \\end{aligned}`,
        true
      )}

      Our goal is to find the coefficients, {@html katexify(`\\beta_0`, false)} and
      {@html katexify(`\\beta_1`, false)}, to minimize the error function. To do
      this, we'll use the gradient, which represents the direction where that
      function is increasing, and the rate at which it is increasing. Gradient
      descent works by taking steps in the direction oppositie of where our
      error function is increasing, proportional to the rate of change. To find
      the coefficients that minimize First, we calculate the derivatives of our
      loss function, MSE:
      {@html katexify(
        `\\frac{\\delta}{\\delta\\beta_i}MSE = \\begin{cases}
        -\\frac{2}{n} \\sum^{n}_{i=1}(y_i - \\hat{y_i}) \\text{for i = 0} \\\\
        -\\frac{2}{n} \\sum^{n}_{i=1}x_i(y_i - \\hat{y_i}) \\text{for i = 1}
        \\end{cases}`,
        true
      )}

      Next, now that we have the gradients for our error function (with respect
      to each coefficient to be updated), we perform iterative updates as:
      {@html katexify(
        `\\text{repeat until converge:} = \\begin{cases}
         \\beta_0 = \\beta_0 - \\alpha (-\\frac{2}{n} \\sum^{n}_{i=1}(y_i - \\hat{y_i}))  \\\\
         \\beta_1 = \\beta_1 - \\alpha (-\\frac{2}{n} x_i\\sum^{n}_{i=1}(y_i - \\hat{y_i})) 
        \\end{cases}`,
        true
      )}

      <br /><br />

      updating these values iteratively will yield coefficients of our model
      that minimize error.
      <br />
    </p>
  </section>
</Hidden>

<p class="body-text">
  <br />
  Gradient descent will iteratively identify the coefficients our model needs to
  fit the data. Let's see an example directly. We'll fit data to our equation {@html katexify(
    `\\begin{aligned} \\hat{y}=\\hat{\\beta_0} + \\hat{\\beta_1}x_1  \\end{aligned}`,
    false
  )}, so gradient descent will learn two coefficients, {@html katexify(
    `\\beta_0`,
    false
  )} (the intercept) and {@html katexify(`\\beta_1`, false)} (the weight). To do
  so, interact witht he plot below. Try dragging the wrights and values to 'poor'
  fit solutions and run gradient descent to see them iteratively improve.
</p>
<br /><br />
<div id="gd-container">
  <div id="equations-container">
    <p class="body-text">
      Let's see how Gradient Descent works directly for our linear regression
      model. We'll use the algorithm to identify which values for our bias and
      weight we should select. Click the buttons to run 1, 10, or 50 steps of
      gradient descent, and see the line update live. The error for each
      iteration will be shown in the bottom error chart. With each weight
      update, we recalculate the error, so you can see how gradient descent
      improves our model iteratively.
    </p>
    <div id="buttons-container">
      <button on:click={() => gdScatterClass.shuffleData()}>New Data</button>
      <button on:click={() => gdScatterClass.runGradientDescent(1)}
        >1 Step</button
      >
      <button on:click={() => gdScatterClass.runGradientDescent(10)}
        >10 Steps</button
      >
      <button on:click={() => gdScatterClass.runGradientDescent(25)}
        >25 Steps</button
      >
    </div>
    <div id="bias-slider">
      <div class="input-container">
        <p>Bias ({@html katexify(`\\beta_0`, false)}): {$gdBias}</p>
        <input
          type="range"
          min="-1"
          step="-1"
          max="16"
          bind:value={$gdBias}
          class="slider"
          id="myRange"
        />
      </div>
    </div>
    <div id="weight-slider">
      <div class="input-container">
        <p>Weight ({@html katexify(`\\beta_1`, false)}): {$gdWeight}</p>
        <input
          type="range"
          min="-1.5"
          max="6"
          step=".01"
          bind:value={$gdWeight}
          class="slider"
          id="myRange"
        />
      </div>
    </div>

    <div id="equation-math">
      Our model: {@html katexify(
        `\\begin{aligned} y = ${$gdWeight}x${
          $gdBias < 0 ? "" : "+"
        }${$gdBias}+c \\end{aligned}`
      )}
    </div>
  </div>
  <div id="charts-container">
    <div id="gd-chart-regression">
      <GradientDescentScatterplot bind:this={gdScatterClass} />
    </div>
    <div id="gd-chart-error">
      <GradientDescentErrorPlot bind:this={gdErrorClass} />
    </div>
  </div>
</div>
<br /><br />
<p class="body-text">
  Although gradient descent is the most popular optimization algorithm in
  machine learning, it's not perfect! It doesn't work for every loss function,
  and it may not always find the most optimal set of coefficients for your
  model. Still, it has many extensions to help solve these issues, and is a
  great choice for mean-squared error.
</p>
<br /><br />

<style>
  #gd-container {
    display: grid;
    grid-template-columns: 50% 50%;
    font-family: var(--font-mono);
    margin: auto;
    max-width: 1000px;
    height: 70vh;
    max-height: 500px;
  }

  #equations-container {
    text-align: center;
    flex-direction: column;
  }

  .gd-math {
    margin: auto;
    max-width: 700px;
    border: 5px solid var(--smile);
    padding: 2rem;
    background-color: var(--paper);
  }

  #buttons-container {
    display: flex;
    margin: 8px auto;
    justify-content: space-around;
    align-items: center;
    width: 90%;
  }

  .input-container {
    display: flex;
    flex-direction: row;
    margin: 8px auto;
    justify-content: space-around;
    align-items: center;
    width: 70%;
  }

  button {
    background-color: var(--smile); /* Green */
    border: none;
    color: white;
    padding: 8px 16px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 14px;
    margin: 4px 2px;
    cursor: pointer;
  }

  button:hover {
    outline: 2px solid var(--squidink);
  }

  button:active {
    color: var(--squidink);
  }

  button:visited {
    color: var(--white);
  }

  button.show-button {
    background-color: var(--bg); /* Green */
    border: none;
    color: var(--squidink);
    padding: 8px 16px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 14px;
    margin: 4px 2px;
    cursor: pointer;
    outline: 2px solid var(--squidink);
  }

  .show-button-container {
    max-width: var(--max-width);
    display: flex;
    margin: 1rem auto;
    justify-content: center;
  }

  #charts-container {
    display: grid;
    grid-template-columns: 100%;
    grid-column-gap: 0rem;
    grid-template-rows: 60% 40%;
    height: 80vh;
    padding-right: 1rem;
    height: 70vh;
    max-height: 500px;
  }

  #gd-chart-regression {
    width: 100%;
    height: 100%;
  }

  /* mobile */
  @media screen and (max-width: 950px) {
    #gd-container {
      display: grid;
      grid-template-columns: 100%;
      margin: auto;
      max-width: 100%;
      width: 100%;
      height: 70vh;
      max-height: 100vh;
    }

    #charts-container {
      max-width: 100%;
    }
  }
</style>
