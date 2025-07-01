class GregoChant extends HTMLElement {
  constructor() {
    super()
    this.score_src = this.innerText
  }
  connectedCallback() {
    /* testing exsurge */
    var ctxt = new exsurge.ChantContext();
    ctxt.lyricTextFont = "'Crimson Text', serif";
    ctxt.lyricTextSize *= 1.2;
    ctxt.dropCapTextFont = ctxt.lyricTextFont;
    ctxt.annotationTextFont = ctxt.lyricTextFont;
    var score;
      if (score) {
        exsurge.Gabc.updateMappingsFromSource(ctxt, score.mappings, this.score_src);
        score.updateNotations(ctxt);
      } else {
        var mappings = exsurge.Gabc.createMappingsFromSource(ctxt, this.score_src);
        var useDropCap = true;
        var useDropCapAttr = this.getAttribute("use-drop-cap");
        if (useDropCapAttr === 'false')
          useDropCap = false;  
        score = new exsurge.ChantScore(ctxt, mappings, useDropCap);
        var annotationAttr = this.getAttribute("annotation");
        if (annotationAttr) {
          // add an annotation
          score.annotation = new exsurge.Annotation(ctxt, annotationAttr);
        }
      }
    this.doLayout = () => {
      // perform layout on the chant
      score.performLayoutAsync(ctxt, () => {
        score.layoutChantLines(ctxt, this.clientWidth, () => {
          // render the score to svg code
          this.innerHTML = score.createSvg(ctxt);
        });
      });
    }
    this.doLayout()
    new ResizeObserver(this.doLayout).observe(this)
  }
}

window.customElements.define("grego-chant", GregoChant);
