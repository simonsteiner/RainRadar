module.exports = {
  extends: [
    "stylelint-config-standard",
    "stylelint-config-recess-order"
  ],
  plugins: [
    "stylelint-order"
  ],
  rules: {
    "declaration-block-no-duplicate-properties": true,
    "declaration-no-important": true,
    "selector-max-id": 1,
    "selector-max-universal": 1,
    "max-nesting-depth": 3,
    "shorthand-property-no-redundant-values": true,
    "no-descending-specificity": true,
    "no-duplicate-selectors": true,
    "length-zero-no-unit": true,
    "color-hex-length": "short",
    "color-named": "never",
    "selector-no-qualifying-type": true,
    "declaration-block-single-line-max-declarations": 1,
    "selector-class-pattern": "^([a-z][a-z0-9]*)(-[a-z0-9]+)*(-{2}[a-z0-9]+)*$",
    "selector-id-pattern": "^[a-z][a-zA-Z0-9]+$"
  }
};