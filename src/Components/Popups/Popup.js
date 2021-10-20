import { BsX } from 'react-icons/bs'
import { Link } from 'react-router-dom'

import { Row, Col, Button } from 'react-bootstrap';
import { FaMapMarkedAlt } from 'react-icons/fa'
import { BiNetworkChart } from 'react-icons/bi'

import translate from "../../Assets/indexes/translate.json"
import nationality from "../../Assets/indexes/nationality.json"
import family_trans from "../../Assets/indexes/religious_family.json"
import cat_trans from "../../Assets/indexes/categories.json"
import relationships from "../../Assets/indexes/relationships.json"



function Popup(props) {
 console.log(props.selectArray)
//CONSTRUCT PERSONAL RELATIONSHIP ARRAY & OUTPUT
  const getPersRels = () => {
    const persRels = props.selectArray.filter(type => type.rel_kind === "Person")
    if (persRels.length > 0) {
      const persList = persRels.map(function(node) {

        function sourceCheck(node) { if (node.rel.source) {
          return (<li className="card_sources list-group-item px-3 py-0 mb-2"><span className="popup_card_header sources">{translate[0]["sources"][props.language]}:</span> {node.rel.source}</li>)
        }}
        let source = sourceCheck(node)

        let rel_name;
           if ((props.language == "zh" || props.language == "tw") && node.node2.chinese_family_name_hanzi) { rel_name = `${node.node2.chinese_family_name_hanzi} ${node.node2.chinese_given_name_hanzi}` }
           else { rel_name = `${node.node2.given_name_western} ${node.node2.family_name_western}`  }

        let rel;
          if (node.rel.rel_type) { rel = node.rel.rel_type }
          else {rel = "N/A"}

          return (
            <ul className="list-group list-group-flush">
              <li className="list-group-item pt-0 pb-0 border-bottom-0">
                <div className="card-body px-0 p-1">
                <Row>
                  <Col className="text-left"><span className="popup_link" onClick={() =>  props.selectSwitchAppend((node.key2))}>{rel_name}</span></Col>
                  <Col className="text-center">{relationships[0][rel.replace(/\s|\//g, '_').toLowerCase()][props.language]}</Col>
                  <Col className="text-end">{node.rel.start_year}-{node.rel.end_year}</Col>
                </Row>
                </div>
              </li>
              {source}
            </ul>
      )
    })
      return (
        <div>
          <h5 className="popup_section_head mt-2">{translate[0]["pers_relationships"][props.language]}</h5>
          <div className="card">
            <div className="popup_card_header card-header">
              <Row>
                <Col className="text-left">{translate[0]["name"][props.language]}</Col>
                <Col className="text-center">{translate[0]["relationship"][props.language]}</Col>
                <Col className="text-end">{translate[0]["years"][props.language]}</Col>
              </Row>
            </div>
            {persList}
          </div>
        </div>)
    } else {}
  };

//CONSTRUCT INSTITUTIONAL RELATIONSHIP ARRAY & OUTPUT
  const getInstRels = () => {
    const instRels = props.selectArray.filter(type => type.rel_kind === "Institution")
    if (instRels.length > 0) {
    const instList = instRels.map(function(node) {

      function sourceCheck(node) { if (node.rel.source) {
        return (<li className="card_sources list-group-item px-3 py-0 mb-2"><span className="popup_card_header sources">{translate[0]["sources"][props.language]}:</span> {node.rel.source}</li>)
      }}
      let source = sourceCheck(node)

      let rel_name;
         if ((props.language == "zh" || props.language == "tw") && node.node2.chinese_name_hanzi) { rel_name = node.node2.chinese_name_hanzi }
         else { rel_name = node.node2.name_western }

       let rel;
         if (node.rel.rel_type) { rel = node.rel.rel_type }
         else {rel = "N/A"}

      return (
        <ul className="list-group list-group-flush">
          <li className="list-group-item pt-0 pb-0 border-bottom-0">
            <div className="card-body px-0 p-1">
              <Row>
                <Col className="text-left"><span className="popup_link" onClick={() =>  props.selectSwitchAppend((node.key2))}>{rel_name}</span></Col>
                <Col className="text-center">{relationships[0][rel.replace(/\s|\//g, '_').toLowerCase()][props.language]}</Col>
                <Col className="text-end">{node.rel.start_year}-{node.rel.end_year}</Col>
              </Row>
            </div>
          </li>
          {source}
        </ul>
  )
  })
    return (
      <div>
        <h5 className="popup_section_head mt-2">{translate[0]["inst_relationships"][props.language]}</h5>
        <div className="card">
          <div className="popup_card_header card-header">
            <Row>
              <Col className="text-left">{translate[0]["name"][props.language]}</Col>
              <Col className="text-center">{translate[0]["relationship"][props.language]}</Col>
              <Col className="text-end">{translate[0]["years"][props.language]}</Col>
            </Row>
          </div>
          {instList}
        </div>
      </div>)
  } else {}
};

//CONSTRUCT CORPORATE ENTITY RELATIONSHIP ARRAY & OUTPUT
const getCorpRels = () => {
  const corpRels = props.selectArray.filter(type => type.rel_kind === "CorporateEntity")
  if (corpRels.length > 0) {
const corpList = corpRels.map(function(node) {

    function sourceCheck(node) { if (node.rel.source) {
      return (<li className="card_sources list-group-item px-3 py-0 mb-2"><span className="popup_card_header sources">{translate[0]["sources"][props.language]}:</span> {node.rel.source}</li>)
    }}
    let source = sourceCheck(node)

    let rel_name;
       if ((props.language == "zh" || props.language == "tw") && node.node2.chinese_name_hanzi) { rel_name = node.node2.chinese_name_hanzi }
       else { rel_name = node.node2.name_western }

    let rel;
      if (node.rel.rel_type) { rel = node.rel.rel_type }
      else {rel = "N/A"}

    return (
      <ul className="list-group list-group-flush">
        <li className="list-group-item pt-0 pb-0 border-bottom-0">
          <div className="card-body px-0 p-1">
            <Row>
              <Col className="text-left"><span className="popup_link" onClick={() =>  props.selectSwitchAppend((node.key2))}>{rel_name}</span></Col>
              <Col className="text-center">{relationships[0][rel.replace(/\s|\//g, '_').toLowerCase()][props.language]}</Col>
              <Col className="text-end">{node.rel.start_year}-{node.rel.end_year}</Col>
            </Row>
          </div>
        </li>
        {source}
      </ul>
    )
  })
  return (
    <div>
      <h5 className="popup_section_head mt-2">{translate[0]["corp_relationships"][props.language]}</h5>
      <div className="card">
        <div className="popup_card_header card-header">
          <Row>
            <Col className="text-left">{translate[0]["name"][props.language]}</Col>
            <Col className="text-center">{translate[0]["relationship"][props.language]}</Col>
            <Col className="text-end">{translate[0]["years"][props.language]}</Col>
          </Row>
        </div>
        {corpList}
      </div>
    </div>)
} else {}
};

//CONSTRUCT EVENT RELATIONSHIP ARRAY & OUTPUT
const getEventRels = () => {
  const eventRels = props.selectArray.filter(type => type.rel_kind === "Event")
  if (eventRels.length > 0) {
  const eventList = eventRels.map(function(node) {

    function sourceCheck(node) { if (node.rel.source) {
      return (<li className="card_sources list-group-item px-3 py-0 mb-2"><span className="popup_card_header sources">{translate[0]["sources"][props.language]}:</span> {node.rel.source}</li>)
    }}
    let source = sourceCheck(node)

    let rel_name;
       if ((props.language == "zh" || props.language == "tw") && node.node2.chinese_name_hanzi) { rel_name = node.node2.chinese_name_hanzi }
       else { rel_name = node.node2.name_western }

   let rel;
     if (node.rel.rel_type) { rel = node.rel.rel_type }
     else {rel = "N/A"}

    return (
      <ul className="list-group list-group-flush">
        <li className="list-group-item pt-0 pb-0 border-bottom-0">
          <div className="card-body px-0 p-1">
            <Row>
              <Col className="text-left"><span className="popup_link" onClick={() =>  props.selectSwitchAppend((node.key2))}>{rel_name}</span></Col>
              <Col className="text-center">{relationships[0][rel.replace(/\s|\//g, '_').toLowerCase()][props.language]}</Col>
              <Col className="text-end">{node.rel.start_year}-{node.rel.end_year}</Col>
            </Row>
          </div>
        </li>
        {source}
      </ul>
)
})
  return (
    <div>
      <h5 className="popup_section_head mt-2">{translate[0]["event_relationships"][props.language]}</h5>
      <div className="card">
        <div className="popup_card_header card-header">
          <Row>
            <Col className="text-left">{translate[0]["name"][props.language]}</Col>
            <Col className="text-center">{translate[0]["relationship"][props.language]}</Col>
            <Col className="text-end">{translate[0]["years"][props.language]}</Col>
          </Row>
        </div>
        {eventList}
      </div>
    </div>)
} else {}
};

//CONSTRUCT BASIC INFORMATION
const getInfo = () => {
   if (props.selectArray.length > 0) {
     const info = props.selectArray[0]
     if (info.select_node.given_name_western) {
       let name;
          if ((props.language == "zh" || props.language == "tw") && info.select_node.chinese_family_name_hanzi) { name = `${info.select_node.chinese_family_name_hanzi} ${info.select_node.chinese_given_name_hanzi}` }
          else { name = `${info.select_node.given_name_western} ${info.select_node.family_name_western}`  }

          let nation;
          if (info.select_node.nationality) {nation = info.select_node.nationality}
          else {nation = "N/A"}

       return (
         <div>
           <Row><Col>
             <h4 className="popup_title" >{name}</h4>
             {props.linkCheck(props, info)}
          </Col></Row>

            <Row><Col>
              <Button className="add_info_button btn btn-danger" data-prop="addinfo" onClick={(i) =>  props.toggleDisplay(i)} role="button" >{translate[0]["additional_info"][props.language]}</Button>
             </Col></Row>
           <div className={props.addinfo}>
             <Row className="pt-2">
               <Col>
               <ul className="list-group list-group-flush">
                 <li className="list-group-item"><b>{translate[0]["alternate_western_names"][props.language]}:</b> {info.select_node.alternative_name_western}</li>
                 <li className="list-group-item"><b>{translate[0]["chinese_name"][props.language]}:</b> {info.select_node.chinese_family_name_hanzi} {info.select_node.chinese_given_name_hanzi}</li>
                 <li className="list-group-item"><b>{translate[0]["alternate_chinese_names"][props.language]}:</b> {info.select_node.alternative_chinese_name_hanzi}</li>
                 <li className="list-group-item"><b>{translate[0]["chinese_name_romanization"][props.language]}:</b> {info.select_node.chinese_family_name_romanized} {info.select_node.chinese_given_name_romanized}</li>
                 <li className="list-group-item"><b>{translate[0]["alternate_chinese_name_romanizations"][props.language]}:</b> {info.select_node.alternative_chinese_name_romanized}</li>
                </ul>
                </Col>
                <Col>
                <ul className="list-group list-group-flush">
                 <li className="list-group-item"><b>{translate[0]["gender"][props.language]}:</b> {info.select_node.gender}</li>
                 <li className="list-group-item"><b>{translate[0]["nationality"][props.language]}:</b> {nationality[0][nation.replace(/\s|\//g, '_').toLowerCase()][props.language]}</li>
                 <li className="list-group-item"><b>{translate[0]["birth_year"][props.language]}:</b> {info.select_node.birth_year}</li>
                 <li className="list-group-item"><b>{translate[0]["birth_place"][props.language]}:</b> {info.select_node.birth_place}</li>
                 <li className="list-group-item"><b>{translate[0]["death_place"][props.language]}:</b> {info.select_node.death_place}</li>
                 <li className="list-group-item"><b>{translate[0]["death_year"][props.language]}:</b> {info.select_node.death_year}</li>
               </ul>
               </Col>
             </Row>
           </div>
         </div>
     )}
     else {

       let name;
          if ((props.language == "zh" || props.language == "tw") && info.select_node.chinese_name_hanzi) { name = info.select_node.chinese_name_hanzi }
          else { name = info.select_node.name_western }

      let trad;
        if (info.select_node.christian_tradition) {trad = info.select_node.christian_tradition}
        else {trad = "N/A"}

      let rel_fam;
        if (info.select_node.religious_family) {rel_fam = info.select_node.religious_family}
          else {rel_fam = "N/A"}
      let cat;
       if (info.select_node.corporate_entity_category) {cat = info.select_node.corporate_entity_category}
       else if (info.select_node.institution_category) {cat = info.select_node.institution_category}
       else if (info.select_node.event_category) { cat = info.select_node.event_category}
       else {cat = "N/A"}
      let subcat;
       if (info.select_node.corporate_entity_subcategory) {subcat = info.select_node.corporate_entity_subcategory}
       else if (info.select_node.institution_subcategory) {subcat = info.select_node.institution_subcategory}
       else if (info.select_node.event_subcategory) { subcat = info.select_node.event_subcategory}
       else {subcat = "N/A"}

       return (

         <div>
           <Row>
             <Row><Col>
              <h4 className="popup_title" >{name}</h4>
              {props.linkCheck(props, info)}
            </Col></Row>

             <Row><Col>
              <Button className="add_info_button btn btn-danger" data-prop="addinfo" onClick={(i) =>  props.toggleDisplay(i)} role="button" >{translate[0]["additional_info"][props.language]}</Button>
             </Col></Row>
           </Row>
           <div className={props.addinfo}>
             <Row className="pt-2">
               <Col>
               <ul className="list-group list-group-flush">
                 <li className="list-group-item"><b>{translate[0]["alternate_western_names"][props.language]}:</b> {info.select_node.alternative_name_western}</li>
                 <li className="list-group-item"><b>{translate[0]["chinese_name"][props.language]}:</b> {info.select_node.chinese_name_hanzi}</li>
                 <li className="list-group-item"><b>{translate[0]["alternate_chinese_names"][props.language]}:</b> {info.select_node.alternative_chinese_name_hanzi}</li>
                 <li className="list-group-item"><b>{translate[0]["chinese_name_romanization"][props.language]}:</b> {info.select_node.chinese_name_romanized}</li>
                 <li className="list-group-item"><b>{translate[0]["alternate_chinese_name_romanizations"][props.language]}:</b> {info.select_node.alternative_chinese_name_romanized}</li>
                </ul>
                </Col>
                <Col>
                <ul className="list-group list-group-flush">
                 <li className="list-group-item"><b>{translate[0]["christian_tradition"][props.language]}:</b> {translate[0][trad.replace(/\s|\//g, '_').toLowerCase()][props.language]}</li>
                 <li className="list-group-item"><b>{translate[0]["religious_family"][props.language]}:</b> {family_trans[0][rel_fam.replace(/\s|\//g, '_').toLowerCase()][props.language]}</li>
                 <li className="list-group-item"><b>{translate[0]["category"][props.language]}:</b> {cat_trans[0][cat.replace(/\s|\//g, '_').toLowerCase()][props.language]}</li>
                 <li className="list-group-item"><b>{translate[0]["subcategory"][props.language]}:</b> {cat_trans[0][subcat.replace(/\s|\//g, '_').toLowerCase()][props.language]}</li>

               </ul>
               </Col>
             </Row>
           </div>
         </div>
     )}
  } else {}
};

//CONSTRUCT BREADCRUMBS
const breadLine = () => {
  const getCurrent = () => {
     if (props.selectArray.length > 0) {
       const info = props.selectArray[0]
       if (info.select_node.given_name_western) {
         if ((props.language == "zh" || props.language == "tw") && info.select_node.chinese_given_name_hanzi) {return (`${info.select_node.chinese_family_name_hanzi}${info.select_node.chinese_given_name_hanzi} `)}
         else {return (`${info.select_node.family_name_western}, ${info.select_node.given_name_western} `)}
       }
       else {
         if (props.language == "zh" || props.language == "tw") {return (info.select_node.chinese_name_hanzi)}
         else {return (info.select_node.name_western)}
       }
     } else {}
   }
   const ellipse  = () => {
     const measure = props.breadCrumb
     if (measure.length > 4) {return (<span>... > </span>)}
     else {}
   }
  const breadList = props.breadCrumb
  if (breadList.length > 1 ) {
    const bread = breadList.map(function(crumb, i) {
      if (breadList.length - 1 === i) {}
      else if (crumb.family_name_western && (breadList.length - i) < 5){
        if ((props.language == "zh" || props.language == "tw") && crumb.chinese_given_name_hanzi ) {
          return (<span><span className="breadcrumb_link" onClick={() =>  props.selectSwitchReduce((crumb.key), (crumb.order))}>{crumb.chinese_family_name_hanzi}{crumb.chinese_given_name_hanzi}</span> > </span>)
        } else {return (<span><span className="breadcrumb_link" onClick={() =>  props.selectSwitchReduce((crumb.key), (crumb.order))}>{crumb.family_name_western}, {crumb.given_name_western}</span> > </span>)}
      }
      else if (crumb.name_western && (breadList.length - i) < 5){
        if ((props.language == "zh" || props.language == "tw") && crumb.chinese_name_hanzi ) {
          return (<span><span className="breadcrumb_link" onClick={() =>  props.selectSwitchReduce((crumb.key), (crumb.order))}>{crumb.chinese_name_hanzi}</span> > </span>)
        } else {return (<span><span className="breadcrumb_link" onClick={() =>  props.selectSwitchReduce((crumb.key), (crumb.order))}>{crumb.name_western}</span> > </span>)}
      }
      else {}
    })
    return (<div className="breadcrumb">{ellipse()} {bread} {getCurrent()}</div>)
  } else {}
};



  return (
    <div className={props.popupcontainer}>
      <BsX className="popup_close" data-prop="popupcontainer" onClick={(i) =>  props.toggleDisplay(i)}/>
        {breadLine()}
        {getInfo()}
        {getPersRels()}
        {getInstRels()}
        {getCorpRels()}
        {getEventRels()}

      </div>
  )
}

export default Popup
