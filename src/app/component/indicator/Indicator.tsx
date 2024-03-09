import styles from "./indicator.module.css"
type IndicatorProps ={
  isOn: boolean
  text: string
}
export function Indicator({isOn, text}:IndicatorProps){
  const onStyle = `${styles.indicator} ${styles.on}`
  const offStyle = styles.indicator
  const indicatorStyle = isOn ? onStyle : offStyle;
  return <div className={indicatorStyle}>{text}</div>
}