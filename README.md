# Style-cond

A tool to do pattern matching for props of style-components, just like write styles using css selectors.

## Install 

npm:
```
npm i styled-cond
```

yarn:
```
yarn add styled-cond
```

## Usage

### Matching specify props
```ts
export const AudioPlay = styled.div<{ isHidden: boolean; isAudioPlayComplete: boolean; }>`
  border-radius: 3px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);

  ${styleCond({
    isHidden: css`
      display: none;
    `,
    isAudioPlayComplete: css`
      opacity: 0.3;
    `
  })}
`;
```

### Matching value fo props
```ts
styled.button<{size: s | m | l | xl; hasBorder: boolean; index:number }>`
  font-size: 14px;
  border-radius: 12px;
  border: 1px solid #c00;

  ${styleCond(
    size: {
      s: css`
        padding: 0 8px;
        text-align: center;
      `,
      m: css`
        padding: 0 10px;
      `,
      l: css`
        padding: 0 12px;
      `,
      xl: css`
        padding: 0 14px;
      `
    },
    hasBorder: {
      false: css`
        border: 0;
      `
    },
    index: {
      1: {
        font-size: 16px
      }
      2: {
        font-size: 18px
      }
    }
  )}
`
```

### Passing props
```ts
export const NavigationButton = styled.button<variant: "primary" | "default">`
  ${styleCond((props) => ({
    variant: {
      primary: css`
        background-color: #ebab45;
        ${!props.isDisabled && css`
          &:hover {
            background-color: #dea612;
          }
        `}
      `,
      default: css`
        background-color: #ffffff;
        ${!props.isDisabled && css`
          &:hover {
            background-color: rgba(0, 0, 0, 0.03);
          }
        `}
      `
    }
  }))}
`
```


### Matching value by specify condition
```ts
export const Gap = styled.input<{ isFocused: boolean; isInputted: boolean; isInteractive: boolean }>`
  ${styleCond((props)=>({
    isInputted: [
      (value) => value && !props.isFocused,
      css`
        border-color: #f5bb23;
        background-color: #f5bb23;
      `
    ],
    isInteractive: [
      (value) => value === false,
      css`
        &:hover {
          box-shadow: none;
        }
      `]
  }))}
`;
```

### Complex conditions
```ts
export const Foo = styled.div<{ max:number }>`
  ${styleCond({
    color: black;

    max: [
      [
        value => value > 100,
        css`
          color: red;
        `
      ],
      [
        value => value > 50,
        css`
          color: green;
        `
      ],
      {
        1: css`
          color: blueviolet;
        `,
        2: css`
          color: pink;
        `
      }
    ]
  })}
`;
```
