# Style-cond

像写 CSS 选择器一样，写 style-components 组件的样式。

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

### 选择属性
```
export const AudioPlay = styled.div<{ isHidden: boolean; isAudioPlayComplete: boolean }>`
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

### 选择属性的值
```
styled.button<{size: s | m | l | xl}>`
  font-size: 14px;
  border-radius: 12px;

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
    }
  )}
`
```

### 传递 props
```
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


### 根据条件选择属性
```
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
