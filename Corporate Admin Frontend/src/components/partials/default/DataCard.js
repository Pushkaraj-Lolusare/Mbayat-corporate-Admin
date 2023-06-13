import React from "react";
import { Card } from "reactstrap";
import { Icon } from "../../Component";
import { useHistory } from 'react-router-dom';



const DataCard = ({ title, amount, percentChange, up, chart: ChartComponent , route}) => {
  const history = useHistory()
  return (
    <Card style={{height:'27vh', }} onClick={()=> history.push(`${process.env.PUBLIC_URL}/${route}`)}>
      <div className="nk-ecwg nk-ecwg6" style={{ width:"100%", }}>
        <div className="card-inner">
          <div className="card-title-group">
            <div className="card-title">
              <h6 className="title">{title}</h6>
            </div>
          </div>
          <div className="data" style={{ width:"calc(100% + 5%", }}>
            <div className="data-group">
              <div className="amount">{amount}</div>
              <div className="nk-ecwg6-ck">{ChartComponent}</div>
            </div>
            {/* <div className="info">
              <span className={`change ${up ? "up text-success" : "down text-danger"}`}>
                <Icon name={`arrow-long-${up ? "up" : "down"}`}></Icon>
                {percentChange}%
              </span>
              <span></span>
            </div> */}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DataCard;
