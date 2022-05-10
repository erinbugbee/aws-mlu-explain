import { annotate, annotationGroup } from "rough-notation";
export const testColor = "rgba(255, 147, 79, .35)";
export const trainColor = "rgba(45, 49, 66, .2)";
export const validationColor = "rgba(	5, 142, 217,.35)";

const annotation1Intro = document.querySelector("#annotation1-intro");
const annotation2Intro = document.querySelector("#annotation2-intro");
const annotation3Intro = document.querySelector("#annotation3-intro");
const annotation1Mobile = document.querySelector("#annotation1-mobile");
const annotation2Mobile = document.querySelector("#annotation2-mobile");
const annotation3Mobile = document.querySelector("#annotation3-mobile");
const annotation4 = document.querySelector("#annotation4");
const annotation5 = document.querySelector("#annotation5");
const annotation6 = document.querySelector("#annotation6");
const annotation7 = document.querySelector("#annotation7");
const annotation8 = document.querySelector("#annotation8");
const annotation9 = document.querySelector("#annotation9");
const annotation10 = document.querySelector("#annotation10");
const annotation11 = document.querySelector("#annotation11");
const annotation12 = document.querySelector("#annotation12");
const annotation10Mobile = document.querySelector("#annotation10-mobile");
const annotation11Mobile = document.querySelector("#annotation11-mobile");
const annotation12Mobile = document.querySelector("#annotation12-mobile");

const a1Intro = annotate(annotation1Intro, {
  type: "highlight",
  color: trainColor,
  strokeWidth: 1,
  iterations: 1,
  animate: false,
  multiline: true,
});
const a2Intro = annotate(annotation2Intro, {
  type: "highlight",
  color: testColor,
  strokeWidth: 1,
  iterations: 1,
  animate: false,
});
const a3Intro = annotate(annotation3Intro, {
  type: "highlight",
  color: validationColor,
  strokeWidth: 1,
  iterations: 1,
  animate: false,
  multiline: true,
});
const a1Mobile = annotate(annotation1Mobile, {
  type: "highlight",
  color: trainColor,
  strokeWidth: 1,
  iterations: 1,
  animate: false,
  multiline: true,
});
const a2Mobile = annotate(annotation2Mobile, {
  type: "highlight",
  color: testColor,
  strokeWidth: 1,
  iterations: 1,
  animate: false,
});
const a3Mobile = annotate(annotation3Mobile, {
  type: "highlight",
  color: validationColor,
  strokeWidth: 1,
  iterations: 1,
  animate: false,
  multiline: true,
});
const a4 = annotate(annotation4, {
  type: "highlight",
  color: trainColor,
  strokeWidth: 1,
  iterations: 1,
  animate: false,
});
const a5 = annotate(annotation5, {
  type: "highlight",
  color: validationColor,
  strokeWidth: 1,
  iterations: 1,
  animate: false,
});
const a6 = annotate(annotation6, {
  type: "highlight",
  color: testColor,
  strokeWidth: 1,
  iterations: 1,
  animate: false,
  multiline: true,
});
const a7 = annotate(annotation7, {
  type: "highlight",
  color: trainColor,
  strokeWidth: 1,
  iterations: 1,
  animate: false,
  multiline: true,
});
const a8 = annotate(annotation8, {
  type: "highlight",
  color: validationColor,
  strokeWidth: 1,
  iterations: 1,
  animate: false,
  multiline: true,
});
const a9 = annotate(annotation9, {
  type: "highlight",
  color: testColor,
  strokeWidth: 1,
  iterations: 1,
  animate: false,
  multiline: true,
});

const a10 = annotate(annotation10, {
  type: "highlight",
  color: trainColor,
  strokeWidth: 1,
  iterations: 1,
  animate: false,
  multiline: true,
});
const a11 = annotate(annotation11, {
  type: "highlight",
  color: validationColor,
  strokeWidth: 1,
  iterations: 1,
  animate: false,
  multiline: true,
});
const a12 = annotate(annotation12, {
  type: "highlight",
  color: testColor,
  strokeWidth: 1,
  iterations: 1,
  animate: false,
  multiline: true,
});
const a10Mobile = annotate(annotation10Mobile, {
  type: "highlight",
  color: trainColor,
  strokeWidth: 1,
  iterations: 1,
  animate: false,
  multiline: true,
});
const a11Mobile = annotate(annotation11Mobile, {
  type: "highlight",
  color: validationColor,
  strokeWidth: 1,
  iterations: 1,
  animate: false,
  multiline: true,
});
const a12Mobile = annotate(annotation12Mobile, {
  type: "highlight",
  color: testColor,
  strokeWidth: 1,
  iterations: 1,
  animate: false,
  multiline: true,
});

const ag = annotationGroup([
  a4,
  a5,
  a6,
  a7,
  a8,
  a9,
  a10,
  a11,
  a12,
  a1Intro,
  a2Intro,
  a3Intro,
  a1Mobile,
  a2Mobile,
  a3Mobile,
  a10Mobile,
  a11Mobile,
  a12Mobile,
]);
ag.show();
