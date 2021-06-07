import TradingViewWidget, {Themes} from 'react-tradingview-widget';

export const BarStyles = {
  BARS: '0',
  CANDLES: '1',
  HOLLOW_CANDLES: '9',
  HEIKIN_ASHI: '8',
  LINE: '2',
  AREA: '3',
  RENKO: '4',
  LINE_BREAK: '7',
  KAGI: '5',
  POINT_AND_FIGURE: '6'
};

const Chart = (props) => {
  return (
    <TradingViewWidget 
      
      // Explicity set these because they will be implemented as states later on
      details={false}
      interval='5'
      show_popup_button={true}
      theme={Themes.DARK}
      hide_side_toolbar={true}
      hide_top_toolbar={true}
      hotlist={false}
      calendar={false}
      withdateranges={false}
      height={610}
      width={980}
      timezone='Etc/UTC'
      style={BarStyles.CANDLES}

      studies={[
          {
            "id": "MAExp@tv-basicstudies",
            "inputs":
            {
              "length": 9,
            }
          },
          {
            "id": "MAExp@tv-basicstudies",
            "inputs":
            {
              "length": 13,
            }
          },
          {
            "id": "MAExp@tv-basicstudies",
            "inputs":
            {
              "length": 21,
            }
          },
          {
            "id": "MAExp@tv-basicstudies",
            "inputs":
            {
              "length": 55,
            }
          },
          {
            "id": "BB@tv-basicstudies",
            "inputs":
            {
              "length": 20
            }
          }
     ]}
      symbol={props.symbol + "USDT"}/>
  )
}
export default Chart;
