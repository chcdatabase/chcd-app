/////////////////////////////////////////////////////////////////////////////////////////////////////
// IMPORTS //////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

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

/////////////////////////////////////////////////////////////////////////////////////////////////////
// COMPONENT ////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

function Popup(props) {

// PEOPLE RELATIONSHIPS CONSTRUCTOR ///////////////////////////////////////////////////////////////////////////////
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
          <h2 className="popup_section_head mt-2">{translate[0]["pers_relationships"][props.language]}</h2>
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

// INSTITUTION RELATIONSHIPS CONSTRUCTOR ///////////////////////////////////////////////////////////////////////////////
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
          <h2 className="popup_section_head mt-2">{translate[0]["inst_relationships"][props.language]}</h2>
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

// CORPORATE ENTITY RELATIONSHIPS CONSTRUCTOR ///////////////////////////////////////////////////////////////////////////////
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
        <h2 className="popup_section_head mt-2">{translate[0]["corp_relationships"][props.language]}</h2>
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

// EVENT RELATIONSHIPS CONSTRUCTOR ///////////////////////////////////////////////////////////////////////////////
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
        <h2 className="popup_section_head mt-2">{translate[0]["event_relationships"][props.language]}</h2>
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

// BASIC INFORMATION CONSTRUCTOR ///////////////////////////////////////////////////////////////////////////////
  const getInfo = () => {
     if (props.selectArray.length > 0) {
       const info = props.selectArray[0]
       if (info.select_node.given_name_western) {

        let name;
          if ((props.language == "zh" || props.language == "tw") && info.select_node.chinese_family_name_hanzi) { name = `${info.select_node.chinese_family_name_hanzi} ${info.select_node.chinese_given_name_hanzi}` }
          else { name = `${info.select_node.given_name_western} ${info.select_node.family_name_western}`  }
        let alt_name_west;
          if (info.select_node.alternative_name_western) { alt_name_west = info.select_node.alternative_name_western }
          else { alt_name_west = translate[0]["n_a"][props.language] }
        let name_hanzi;
          if (info.select_node.chinese_family_name_hanzi) { name_hanzi = `${info.select_node.chinese_family_name_hanzi} ${info.select_node.chinese_given_name_hanzi}` }
          else { name_hanzi = translate[0]["n_a"][props.language] }
        let alt_name_hanzi;
          if (info.select_node.alternative_chinese_name_hanzi) { alt_name_hanzi = info.select_node.alternative_chinese_name_hanzi }
          else { alt_name_hanzi = translate[0]["n_a"][props.language] }
        let name_rom;
          if (info.select_node.chinese_family_name_romanized) { name_rom = `${info.select_node.chinese_family_name_romanized} ${info.select_node.chinese_given_name_romanized}` }
          else { name_rom = translate[0]["n_a"][props.language] }
        let alt_name_rom;
          if (info.select_node.alternative_chinese_name_romanized) { alt_name_rom = info.select_node.alternative_chinese_name_romanized }
          else { alt_name_rom = translate[0]["n_a"][props.language] }
        let gender;
          if (info.select_node.gender) { gender = translate[0][info.select_node.gender.replace(/\s|\//g, '_').toLowerCase()][props.language] }
          else { gender = translate[0]["n_a"][props.language] }
        let nation;
          if (info.select_node.nationality) { nation = nationality[0][info.select_node.nationality.replace(/\s|\//g, '_').toLowerCase()][props.language] }
          else { nation = translate[0]["n_a"][props.language] }
        let birth_year;
          if (info.select_node.birth_year) { birth_year = info.select_node.birth_year }
          else { birth_year = translate[0]["n_a"][props.language] }
        let birth_place;
          if (info.select_node.birth_place) { birth_place = info.select_node.birth_place }
          else { birth_place = translate[0]["n_a"][props.language] }
        let death_year;
          if (info.select_node.death_year) { death_year = info.select_node.death_year }
          else { death_year = translate[0]["n_a"][props.language] }
        let death_place;
          if (info.select_node.death_place) { death_place = info.select_node.death_place }
          else { death_place = translate[0]["n_a"][props.language] }

         return (
           <div>
             <Row><Col>
               <h1 className="popup_title" >{name}</h1>
               {props.linkCheck(props, info)}
            </Col></Row>

              <Row><Col>
                <Button className="add_info_button btn btn-danger" data-prop="addinfo" onClick={(i) =>  props.toggleDisplay(i)} role="button" >{translate[0]["additional_info"][props.language]}</Button>
               </Col></Row>
             <div className={props.addinfo}>
               <Row className="pt-2">
                 <Col>
                 <ul className="list-group list-group-flush">
                   <li className="list-group-item"><b>{translate[0]["alternate_western_names"][props.language]}:</b> {alt_name_west}</li>
                   <li className="list-group-item"><b>{translate[0]["chinese_name"][props.language]}:</b> {name_hanzi}</li>
                   <li className="list-group-item"><b>{translate[0]["alternate_chinese_names"][props.language]}:</b> {alt_name_hanzi}</li>
                   <li className="list-group-item"><b>{translate[0]["chinese_name_romanization"][props.language]}:</b> {name_rom}</li>
                   <li className="list-group-item"><b>{translate[0]["alternate_chinese_name_romanizations"][props.language]}:</b> {alt_name_rom}</li>
                  </ul>
                  </Col>
                  <Col>
                  <ul className="list-group list-group-flush">
                   <li className="list-group-item"><b>{translate[0]["gender"][props.language]}:</b> {gender}</li>
                   <li className="list-group-item"><b>{translate[0]["nationality"][props.language]}:</b> {nation}</li>
                   <li className="list-group-item"><b>{translate[0]["birth_year"][props.language]}:</b> {birth_year}</li>
                   <li className="list-group-item"><b>{translate[0]["birth_place"][props.language]}:</b> {birth_place}</li>
                   <li className="list-group-item"><b>{translate[0]["death_place"][props.language]}:</b> {death_place}</li>
                   <li className="list-group-item"><b>{translate[0]["death_year"][props.language]}:</b> {death_year}</li>
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
          let alt_name_west;
            if (info.select_node.alternative_name_western) { alt_name_west = info.select_node.alternative_name_western }
            else { alt_name_west = translate[0]["n_a"][props.language] }
          let name_hanzi;
            if (info.select_node.chinese_name_hanzi) { name_hanzi = info.select_node.chinese_name_hanzi }
            else { name_hanzi = translate[0]["n_a"][props.language] }
          let alt_name_hanzi;
            if (info.select_node.alternative_chinese_name_hanzi) { alt_name_hanzi = info.select_node.alternative_chinese_name_hanzi }
            else { alt_name_hanzi = translate[0]["n_a"][props.language] }
          let name_rom;
            if (info.select_node.chinese_name_romanized) { name_rom = info.select_node.chinese_name_romanized }
            else { name_rom = translate[0]["n_a"][props.language] }
          let alt_name_rom;
            if (info.select_node.alternative_chinese_name_romanized) { alt_name_rom = info.select_node.alternative_chinese_name_romanized }
            else { alt_name_rom = translate[0]["n_a"][props.language] }
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
                <h1 className="popup_title" >{name}</h1>
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
                   <li className="list-group-item"><b>{translate[0]["alternate_western_names"][props.language]}:</b> {alt_name_west}</li>
                   <li className="list-group-item"><b>{translate[0]["chinese_name"][props.language]}:</b> {name_hanzi}</li>
                   <li className="list-group-item"><b>{translate[0]["alternate_chinese_names"][props.language]}:</b> {alt_name_hanzi}</li>
                   <li className="list-group-item"><b>{translate[0]["chinese_name_romanization"][props.language]}:</b> {name_rom}</li>
                   <li className="list-group-item"><b>{translate[0]["alternate_chinese_name_romanizations"][props.language]}:</b> {name_rom}</li>
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

// BREADCRUMB CONSTRUCTOR ///////////////////////////////////////////////////////////////////////////////
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

// RETURN ///////////////////////////////////////////////////////////////////////////////////////////////
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

/////////////////////////////////////////////////////////////////////////////////////////////////////
// EXPORT //////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

export default Popup
