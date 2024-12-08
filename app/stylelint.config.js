module.exports = {
  extends: [
    "stylelint-config-standard",
    "stylelint-config-recess-order"
  ],
  plugins: [
    "stylelint-order"
  ],
  rules: {
    "selector-class-pattern": "^[a-z][a-zA-Z0-9]+$",
    "declaration-block-no-duplicate-properties": true,
    "declaration-no-important": true,
    "selector-max-id": 0,
    "selector-max-universal": 1,
    "max-nesting-depth": 3,
    "shorthand-property-no-redundant-values": true,
    "no-descending-specificity": true,
    "no-duplicate-selectors": true,
    "length-zero-no-unit": true,
    "color-hex-length": "short",
    "color-named": "never",
    "selector-no-qualifying-type": true,
    "declaration-block-single-line-max-declarations": 1
  }
};