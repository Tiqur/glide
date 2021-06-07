import styles from './styles.module.scss';


const Text = (props) => {
  return (
    <p style={{
      color: props.color ? props.color : '#CDCDCD',
      fontWeight: props.weight ? props.weight : 'initial',
      fontSize: (props.size ? props.size : 'initial') + 'ch',
      fontFamily: props.family ? props.family : 'Roboto',
      padding: props.padding ? props.padding : 'initial',
      margin: props.margin ? props.margin : 'initial'
    }} children={props.children} className={props.underline ? styles.hover_underline_animation : ''} id={props.id}/>
  )
}

export default Text;

