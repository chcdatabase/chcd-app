/////////////////////////////////////////////////////////////////////////////////////////////////////
// COMPONENT ////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

import { BsX } from 'react-icons/bs'
import { Row, Col, Button } from 'react-bootstrap';
import translate from "../../Assets/indexes/translate.json"
import nationality from "../../Assets/indexes/nationality.json"
import family_trans from "../../Assets/indexes/religious_family.json"
import cat_trans from "../../Assets/indexes/categories.json"

/////////////////////////////////////////////////////////////////////////////////////////////////////
// COMPONENT ////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

function Citation(props) {

  const getCitation = () => {

    let alex;
    if (props.language === "en") {alex = "Alex Mayfield"}
    else {alex = "马飞立"}

    let daryl;
    if (props.language === "en") {daryl = "Daryl Ireland"}
    else {daryl = "艾德恩"}

    let eugenio;
    if (props.language === "en") {eugenio = ", and Eugenio Menegon"}
    else {eugenio = "和梅欧金"}


    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    const monthlist = ["January","February","March","April","May","June","July","August","September","October","November","December"];

    let access_date;
    if (props.language === "en") {access_date = monthlist[month] + " " + day + ", " + year }
    else {access_date = year + " 年 " + month + "月" + day + " 日"}

    let publish_date;
    if (props.language === "en") { publish_date = "June 24, 2022" }
    else {publish_date = "2022 年 6 月 24 日" }

    return (<div>{alex}, {daryl}{eugenio}. <i>{translate[0].chcd_name[props.language]}.</i> V1. {publish_date}. {translate[0].accessed[props.language]} {access_date}. https://data.chcdatabase.com.</div>)
  };

  return (
    <div className={props.cite} >
      <div className="cite_message p-3">
      <BsX className="results_close m-2" data-prop="cite" onClick={(i) =>  props.toggleCite(i)}/>
        <Row>
          <Col className="m-2 y-auto" style={{textIndent: '-20px', paddingLeft: '20px', wordWrap: 'break-word'}}>
            <h3>{translate[0].citation[props.language]}</h3>
            {getCitation()}
          </Col>
        </Row>
      </div>
    </div>
  )
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
// EXPORT //////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

export default Citation
