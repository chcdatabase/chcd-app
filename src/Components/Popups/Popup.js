/////////////////////////////////////////////////////////////////////////////////////////////////////
// IMPORTS //////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

import { BsX } from 'react-icons/bs'
import { Row, Col, Button, Card } from 'react-bootstrap';
import { FaRegFileExcel, FaLink, FaQuoteRight } from 'react-icons/fa'
import { BiDownload } from 'react-icons/bi'
import translate from "../../Assets/indexes/translate.json"
import nationality from "../../Assets/indexes/nationality.json"
import family_trans from "../../Assets/indexes/religious_family.json"
import cat_trans from "../../Assets/indexes/categories.json"
import relationships from "../../Assets/indexes/relationships.json"
import CsvDownloadButton from 'react-json-to-csv'
import { ButtonExportExcel } from '@alckor127/react-button-export-excel'
import ReactTooltip from "react-tooltip"
import { useAlert } from 'react-alert'


/////////////////////////////////////////////////////////////////////////////////////////////////////
// COMPONENT ////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

function Popup(props) {

const alert = useAlert()
const print = props.printArray;
const basic = props.basicArray;
const all = basic.concat(print);
const printPers = print.filter(i => i.end_type === "Person");
const printInst = print.filter(i => i.end_type === "Institution");
const printCorp = print.filter(i => i.end_type === "CorporateEntity");
const printEvent = print.filter(i => i.end_type === "Event");
const printPub = print.filter(i => i.end_type === "Publication");


// PEOPLE RELATIONSHIPS CONSTRUCTOR ///////////////////////////////////////////////////////////////////////////////
  const getPersRels = () => {

    function titleize(str) {
      str = str.toString().toLowerCase().replace('\(','\( ').replace('\[','\[ ').split(' ');
      for (var i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
      }
      return str.join(' ').replace('\( ','\(').replace('\[ ','\[');
     }

    const persRels = props.selectArray.filter(type => type.rel_kind === "Person")
    if (persRels.length > 0) {
      const persList = persRels.map(function(node) {

        function sourceCheck(node) { if (node.rel.source) {
          return (<li className="card_sources list-group-item px-3 pt-0 pb-1 border-0 border-bottom-1"><span className="popup_card_header sources">{translate[0]["sources"][props.language]}:</span> {node.rel.source}</li>)
        }}
        let source = sourceCheck(node)

        function noteCheck(node) { if (node.rel.notes) {
          return (<li className="card_sources list-group-item px-3 pt-0 pb-1 border-0 border-bottom-1"><span className="popup_card_header sources">{translate[0]["note"][props.language]}:</span> {node.rel.notes}</li>)
        }}
        let note = noteCheck(node)

        let rel_name;
           if ((props.language == "zh" || props.language == "tw") && node.node2.chinese_family_name_hanzi && node.node2.chinese_given_name_hanzi) { rel_name = `${node.node2.chinese_family_name_hanzi} ${node.node2.chinese_given_name_hanzi}` }
           if ((props.language == "zh" || props.language == "tw") && node.node2.chinese_family_name_hanzi) { rel_name = `${node.node2.chinese_family_name_hanzi} ${node.node2.given_name_western}` }
           else { rel_name = `${node.node2.given_name_western} ${node.node2.family_name_western}` }

        let rel;
          if (node.rel.rel_type) { rel = node.rel.rel_type }
          else {rel = "N/A"}

          let relcheck;
            if (relationships[0][rel.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()] === undefined ) {relcheck = titleize(rel)}
            else {relcheck = relationships[0][rel.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()][props.language]}

          let datecheck;
            if (node.rel.start_year && node.rel.end_year)  {datecheck = node.rel.start_year+"-"+node.rel.end_year}
            else if (node.rel.start_year) {datecheck = node.rel.start_year}
            else if (node.rel.end_year) {datecheck = node.rel.start_year}
            else {datecheck = "Unknown"}

          return (
            <ul className="list-group list-group-flush border border-top-0 border-right-0 border-left-0 border-bottom-1">
              <li className="list-group-item pt-0 pb-0 border-0">
                <div className="card-body px-0 p-1 border-0">
                <Row>
                  <Col className="text-left">{relcheck}</Col>
                  <Col className="text-center"><span className="popup_link" onClick={() =>  props.selectSwitchAppend((node.key2))}>{rel_name}</span></Col>
                  <Col className="text-end">{datecheck}</Col>
                </Row>
                </div>
              </li>
              {source}{note}
            </ul>
      )
    })
      return (
          <div>
          <div className="pb-3">
          <h2 className="popup_section_head mt-2">{translate[0]["pers_relationships"][props.language]}
          <Button className="btn btn-sm btn-danger mx-2" data-prop="addpers" onClick={(i) =>  props.toggleDisplay(i)} role="button" >{translate[0][props.addperstext][props.language]}</Button>
          <CsvDownloadButton delimiter="*" data={printPers} style={{borderWidth:'0px', width:'0px', padding:'0px'}}> 
            <BiDownload className="download-icons" data-tip data-for="pers_rels"/> 
            <ReactTooltip id="pers_rels" place="bottom" effect="solid">{translate[0]["download_pers_rels"][props.language]}</ReactTooltip>
          </CsvDownloadButton>
          </h2>
           <div className={props.addpers + ' card'}>
            <div className="popup_card_header card-header bg-light">
              <Row>
                <Col className="text-left">{translate[0]["relationship"][props.language]}</Col>
                <Col className="text-center">{translate[0]["name"][props.language]}</Col>
                <Col className="text-end">{translate[0]["years"][props.language]}</Col>
              </Row>
            </div>
            {persList}
          </div>
          </div>
        </div>
      )
    } else {}
  };

// INSTITUTION RELATIONSHIPS CONSTRUCTOR ///////////////////////////////////////////////////////////////////////////////
  const getInstRels = () => {

    function titleize(str) {
      str = str.toString().toLowerCase().replace('\(','\( ').replace('\[','\[ ').split(' ');
      for (var i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
      }
      return str.join(' ').replace('\( ','\(').replace('\[ ','\[');
     }

    const instRels = props.selectArray.filter(type => type.rel_kind === "Institution").sort((a, b) => {
      if (a.rel.start_year && b.rel.start_year) {
        return a.rel.start_year - b.rel.start_year;
      } else if (a.rel.start_year) {
        return -1;
      } else if (b.rel.start_year) {
        return 1;
      } else {
        return 0;
      }
    });
    if (instRels.length > 0) {
    const instList = instRels.map(function(node) {

      function sourceCheck(node) { if (node.rel.source) {
        return (<li className="card_sources list-group-item px-3 pt-0 pb-1 border-0 border-bottom-1"><span className="popup_card_header sources">{translate[0]["sources"][props.language]}:</span> {node.rel.source}</li>)
      }}
      let source = sourceCheck(node)

      function noteCheck(node) { if (node.rel.notes) {
        return (<li className="card_sources list-group-item px-3 pt-0 pb-1 border-0 border-bottom-1"><span className="popup_card_header sources">{translate[0]["note"][props.language]}:</span> {node.rel.notes}</li>)
      }}
      let note = noteCheck(node)

      let rel_name;
         if ((props.language == "zh" || props.language == "tw") && node.node2.chinese_name_hanzi) { rel_name = node.node2.chinese_name_hanzi }
         else { rel_name = node.node2.name_western }

     let rel;
       if (node.rel.rel_type) { rel = node.rel.rel_type }
       else {rel = "N/A"}

     let relcheck;
       if (relationships[0][rel.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()] === undefined ) {relcheck = titleize(rel)}
       else {relcheck = relationships[0][rel.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()][props.language]}

     let datecheck;
       if (node.rel.start_year && node.rel.end_year)  {datecheck = node.rel.start_year+"-"+node.rel.end_year}
       else if (node.rel.start_year) {datecheck = node.rel.start_year}
       else if (node.rel.end_year) {datecheck = node.rel.start_year}
       else {datecheck = "Unknown"}

      return (
        <ul className="list-group list-group-flush border border-top-0 border-right-0 border-left-0 border-bottom-1">
          <li className="list-group-item pt-0 pb-0 border-0">
            <div className="card-body px-0 p-1 border-0">
              <Row>
                <Col className="text-left">{relcheck}</Col>
                <Col className="text-center"><span className="popup_link" onClick={() =>  props.selectSwitchAppend((node.key2))}>{rel_name}</span></Col>
                <Col className="text-end">{datecheck}</Col>
              </Row>
            </div>
          </li>
          {source}{note}
        </ul>
    )
    })
      return (
          <div>
          <div className="pb-3">
          <h2 className="popup_section_head mt-2">{translate[0]["inst_relationships"][props.language]}
          <Button className="btn btn-sm btn-danger mx-2" data-prop="addinst" onClick={(i) =>  props.toggleDisplay(i)} role="button" >{translate[0][props.addinsttext][props.language]}</Button>
          <CsvDownloadButton delimiter="*" data={printInst} style={{borderWidth:'0px', width:'0px', padding:'0px'}}> 
            <BiDownload className="download-icons" data-tip data-for="inst_rels"/> 
            <ReactTooltip id="inst_rels" place="bottom" effect="solid">{translate[0]["download_inst_rels"][props.language]}</ReactTooltip>
          </CsvDownloadButton>
          </h2>
           <div className={props.addinst + ' card'}>
            <div className="popup_card_header card-header">
              <Row>
                <Col className="text-left">{translate[0]["relationship"][props.language]}</Col>
                <Col className="text-center">{translate[0]["institution"][props.language]}</Col>
                <Col className="text-end">{translate[0]["years"][props.language]}</Col>
              </Row>
            </div>
            {instList}
          </div>
          </div>
        </div>
      )
    } else {}
  };

// CORPORATE ENTITY RELATIONSHIPS CONSTRUCTOR ///////////////////////////////////////////////////////////////////////////////
  const getCorpRels = () => {

    function titleize(str) {
      str = str.toString().toLowerCase().replace('\(','\( ').replace('\[','\[ ').split(' ');
      for (var i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
      }
      return str.join(' ').replace('\( ','\(').replace('\[ ','\[');
     }

    const corpRels = props.selectArray
    .filter(type => type.rel_kind === "CorporateEntity")
    if (corpRels.length > 0) {
  const corpList = corpRels.map(function(node) {

      function sourceCheck(node) { if (node.rel.source) {
        return (<li className="card_sources list-group-item px-3 pt-0 pb-1 border-0 border-bottom-1"><span className="popup_card_header sources">{translate[0]["sources"][props.language]}:</span> {node.rel.source}</li>)
      }}
      let source = sourceCheck(node)

      function noteCheck(node) { if (node.rel.notes) {
        return (<li className="card_sources list-group-item px-3 pt-0 pb-1 border-0 border-bottom-1"><span className="popup_card_header sources">{translate[0]["note"][props.language]}:</span> {node.rel.notes}</li>)
      }}
      let note = noteCheck(node)

      let rel_name;
         if ((props.language == "zh" || props.language == "tw") && node.node2.chinese_name_hanzi) { rel_name = node.node2.chinese_name_hanzi }
         else { rel_name = node.node2.name_western }

      let rel;
        if (node.rel.rel_type) { rel = node.rel.rel_type }
        else {rel = "N/A"}

      let relcheck;
        if (relationships[0][rel.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()] === undefined ) {relcheck = titleize(rel)}
        else {relcheck = relationships[0][rel.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()][props.language]}

      let datecheck;
        if (node.rel.start_year && node.rel.end_year)  {datecheck = node.rel.start_year+"-"+node.rel.end_year}
        else if (node.rel.start_year) {datecheck = node.rel.start_year}
        else if (node.rel.end_year) {datecheck = node.rel.start_year}
        else {datecheck = "Unknown"}

      return (
        <ul className="list-group list-group-flush border border-top-0 border-right-0 border-left-0 border-bottom-1">
          <li className="list-group-item pt-0 pb-0 border-0">
            <div className="card-body px-0 p-1 border-0">
              <Row>
                <Col className="text-left">{relcheck}</Col>
                <Col className="text-center"><span className="popup_link" onClick={() =>  props.selectSwitchAppend((node.key2))}>{rel_name}</span></Col>
                <Col className="text-end">{datecheck}</Col>
              </Row>
            </div>
          </li>
          {source}{note}
        </ul>
      )
    })
    return (
        <div>
        <div className="pb-3">
        <h2 className="popup_section_head mt-2">{translate[0]["corp_relationships"][props.language]}
        <Button className="btn btn-sm btn-danger mx-2" data-prop="addcorp" onClick={(i) =>  props.toggleDisplay(i)} role="button" >{translate[0][props.addcorptext][props.language]}</Button>
        <CsvDownloadButton delimiter="*" data={printCorp} style={{borderWidth:'0px', width:'0px', padding:'0px'}}> 
          <BiDownload className="download-icons" data-tip data-for="corp_rels"/> 
          <ReactTooltip id="corp_rels" place="bottom" effect="solid">{translate[0]["download_corp_rels"][props.language]}</ReactTooltip>
        </CsvDownloadButton>
        </h2>
         <div className={props.addcorp + ' card'}>
          <div className="popup_card_header card-header">
            <Row>
              <Col className="text-left">{translate[0]["relationship"][props.language]}</Col>
              <Col className="text-center">{translate[0]["corporate_entity"][props.language]}</Col>
              <Col className="text-end">{translate[0]["years"][props.language]}</Col>
            </Row>
          </div>
          {corpList}
        </div>
        </div>
      </div>
    )
  } else {}
  };

// EVENT RELATIONSHIPS CONSTRUCTOR ///////////////////////////////////////////////////////////////////////////////
  const getEventRels = () => {
    
    function titleize(str) {
      str = str.toString().toLowerCase().replace('\(','\( ').replace('\[','\[ ').split(' ');
      for (var i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
      }
      return str.join(' ').replace('\( ','\(').replace('\[ ','\[');
     }
     const eventRels = props.selectArray.filter(type => type.rel_kind === "Event")
    if (eventRels.length > 0) {
    const eventList = eventRels.map(function(node) {

      function sourceCheck(node) { if (node.rel.source) {
        return (<li className="card_sources list-group-item px-3 pt-0 pb-1 border-0 border-bottom-1"><span className="popup_card_header sources">{translate[0]["sources"][props.language]}:</span> {node.rel.source}</li>)
      }}
      let source = sourceCheck(node)

      function noteCheck(node) { if (node.rel.notes) {
        return (<li className="card_sources list-group-item px-3 pt-0 pb-1 border-0 border-bottom-1"><span className="popup_card_header sources">{translate[0]["note"][props.language]}:</span> {node.rel.notes}</li>)
      }}
      let note = noteCheck(node)

      let rel_name;
         if ((props.language == "zh" || props.language == "tw") && node.node2.chinese_name_hanzi) { rel_name = node.node2.chinese_name_hanzi }
         else { rel_name = node.node2.name_western }

     let rel;
       if (node.rel.rel_type) { rel = node.rel.rel_type }
       else {rel = "N/A"}

     let relcheck;
       if (relationships[0][rel.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()] === undefined ) {relcheck = titleize(rel)}
       else {relcheck = relationships[0][rel.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()][props.language]}

     let datecheck;
       if (node.rel.start_year && node.rel.end_year)  {datecheck = node.rel.start_year+"-"+node.rel.end_year}
       else if (node.rel.start_year) {datecheck = node.rel.start_year}
       else if (node.rel.end_year) {datecheck = node.rel.start_year}
       else {datecheck = "Unknown"}

      return (
        <ul className="list-group list-group-flush border border-top-0 border-right-0 border-left-0 border-bottom-1">
          <li className="list-group-item pt-0 pb-0 border-0">
            <div className="card-body px-0 p-1 border-0">
              <Row>
                <Col className="text-left">{relcheck}</Col>
                <Col className="text-center"><span className="popup_link" onClick={() =>  props.selectSwitchAppend((node.key2))}>{rel_name}</span></Col>
                <Col className="text-end">{datecheck}</Col>
              </Row>
            </div>
          </li>
          {source}{note}
        </ul>
  )
  })
    return (
        <div>
        <div className="pb-3">
        <h2 className="popup_section_head mt-2">{translate[0]["event_relationships"][props.language]}
        <Button className="btn btn-sm btn-danger mx-2" data-prop="addevent" onClick={(i) =>  props.toggleDisplay(i)} role="button" >{translate[0][props.addeventtext][props.language]}</Button>
        <CsvDownloadButton delimiter="*" data={printEvent} style={{borderWidth:'0px', width:'0px', padding:'0px'}}> 
          <BiDownload className="download-icons" data-tip data-for="event_rels"/> 
          <ReactTooltip id="event_rels" place="bottom" effect="solid">{translate[0]["download_event_rels"][props.language]}</ReactTooltip>
          </CsvDownloadButton>
        </h2>
         <div className={props.addevent + ' card'}>
          <div className="popup_card_header card-header">
            <Row>
              <Col className="text-left">{translate[0]["relationship"][props.language]}</Col>
              <Col className="text-center">{translate[0]["event"][props.language]}</Col>
              <Col className="text-end">{translate[0]["years"][props.language]}</Col>
            </Row>
          </div>
          {eventList}
        </div>
        </div>
      </div>
    )
  } else {}
  };

// PUBLICATION RELATIONSHIPS CONSTRUCTOR ///////////////////////////////////////////////////////////////////////////////
const getPubRels = () => {

  function titleize(str) {
    str = str.toString().toLowerCase().replace('\(','\( ').replace('\[','\[ ').split(' ');
    for (var i = 0; i < str.length; i++) {
      str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
    }
    return str.join(' ').replace('\( ','\(').replace('\[ ','\[');
   }

  const pubRels = props.selectArray.filter(type => type.rel_kind === "Publication")
  if (pubRels.length > 0) {
  const pubList = pubRels.map(function(node) {

    function sourceCheck(node) { if (node.rel.source) {
      return (<li className="card_sources list-group-item px-3 pt-0 pb-1 border-0 border-bottom-1"><span className="popup_card_header sources">{translate[0]["sources"][props.language]}:</span> {node.rel.source}</li>)
    }}
    let source = sourceCheck(node)

    function noteCheck(node) { if (node.rel.notes) {
      return (<li className="card_sources list-group-item px-3 pt-0 pb-1 border-0 border-bottom-1"><span className="popup_card_header sources">{translate[0]["note"][props.language]}:</span> {node.rel.notes}</li>)
    }}
    let note = noteCheck(node)

    let rel_name;
       if ((props.language == "zh" || props.language == "tw") && node.node2.chinese_name_hanzi) { rel_name = node.node2.chinese_name_hanzi }
       else { rel_name = node.node2.name_western }

   let rel;
     if (node.rel.rel_type) { rel = node.rel.rel_type }
     else {rel = "N/A"}

   let relcheck;
     if (relationships[0][rel.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()] === undefined ) {relcheck = titleize(rel)}
     else {relcheck = relationships[0][rel.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()][props.language]}

   let datecheck;
     if (node.rel.start_year && node.rel.end_year)  {datecheck = node.rel.start_year+"-"+node.rel.end_year}
     else if (node.rel.start_year) {datecheck = node.rel.start_year}
     else if (node.rel.end_year) {datecheck = node.rel.start_year}
     else {datecheck = "Unknown"}

    return (
      <ul className="list-group list-group-flush border border-top-0 border-right-0 border-left-0 border-bottom-1">
        <li className="list-group-item pt-0 pb-0 border-0">
          <div className="card-body px-0 p-1 border-0">
            <Row>
              <Col className="text-left">{relcheck}</Col>
              <Col className="text-center"><span className="popup_link" onClick={() =>  props.selectSwitchAppend((node.key2))}>{rel_name}</span></Col>
              <Col className="text-end">{datecheck}</Col>
            </Row>
          </div>
        </li>
        {source}{note}
      </ul>
)
})
  return (
      <div>
      <div className="pb-3">
      <h2 className="popup_section_head mt-2">{translate[0]["publication_relationships"][props.language]}
      <Button className="btn btn-sm btn-danger mx-2" data-prop="addpub" onClick={(i) =>  props.toggleDisplay(i)} role="button" >{translate[0][props.addeventtext][props.language]}</Button>
      <CsvDownloadButton delimiter="*" data={printPub} style={{borderWidth:'0px', width:'0px', padding:'0px'}}> 
        <BiDownload className="download-icons" data-tip data-for="pub_rels"/> 
        <ReactTooltip id="pub_rels" place="bottom" effect="solid">{translate[0]["download_pub_rels"][props.language]}</ReactTooltip>
        </CsvDownloadButton>
      </h2>
       <div className={props.addevent + ' card'}>
        <div className="popup_card_header card-header">
          <Row>
            <Col className="text-left">{translate[0]["relationship"][props.language]}</Col>
            <Col className="text-center">{translate[0]["event"][props.language]}</Col>
            <Col className="text-end">{translate[0]["years"][props.language]}</Col>
          </Row>
        </div>
        {pubList}
      </div>
      </div>
    </div>
  )
} else {}
};

// BASIC INFORMATION CONSTRUCTOR ///////////////////////////////////////////////////////////////////////////////
  const getInfo = () => {

     if (props.selectArray.length > 0) {

       const info = props.selectArray[0];

       // SET STANDARD INFORMATION ////////////////////

        //Set Header Name
        let name;
          if (info.select_node.given_name_western) {
            if ((props.language == "zh" || props.language == "tw") && info.select_node.chinese_family_name_hanzi) { name = `${info.select_node.chinese_family_name_hanzi} ${info.select_node.chinese_given_name_hanzi}` }
            else { name = `${info.select_node.given_name_western} ${info.select_node.family_name_western}`  }
          }
          else if (info.select_node.name_western) {
            if ((props.language == "zh" || props.language == "tw") && info.select_node.chinese_name_hanzi) { name = info.select_node.chinese_name_hanzi }
            else { name = info.select_node.name_western }
          }
          else if (info.select_node.name_wes) {
            if (props.language == "zh" || props.language == "tw") { name = info.select_node.name_zh }
            else { name = info.select_node.name_wes }
          };

        //Set Western Name
        let wes_name;
          if (info.select_node.given_name_western) {wes_name = `${info.select_node.given_name_western} ${info.select_node.family_name_western}`}
          else if (info.select_node.name_western)  { wes_name = info.select_node.name_western }
          else if (info.select_node.name_wes)  { wes_name = info.select_node.name_wes };

        //Set Alternative Western Name
        let alt_wes_name;
          if (info.select_node.alternative_name_western) {alt_wes_name = `${info.select_node.alternative_name_western} ${info.select_node.alternative_name_western}`}
          else { alt_wes_name = translate[0]["n_a"][props.language] };

        //Set Hanzi Name
        let hanzi_name;
          if (info.select_node.chinese_family_name_hanzi && info.select_node.chinese_given_name_hanzi) {hanzi_name = `${info.select_node.chinese_family_name_hanzi} ${info.select_node.chinese_given_name_hanzi}`}
          else if (info.select_node.chinese_family_name_hanzi) {hanzi_name = info.select_node.chinese_family_name_hanzi}
          else if (info.select_node.chinese_given_name_hanzi) {hanzi_name = info.select_node.chinese_given_name_hanzi}
          else if (info.select_node.chinese_name_hanzi) { hanzi_name = info.select_node.chinese_name_hanzi }
          else if (info.select_node.name_zh) { hanzi_name = info.select_node.name_zh }
          else { hanzi_name = translate[0]["n_a"][props.language] }

        //Set Romanized Name
        let rom_name;
          if (info.select_node.chinese_family_name_romanized && info.select_node.chinese_given_name_romanized) {rom_name = `${info.select_node.chinese_family_name_romanized} ${info.select_node.chinese_given_name_romanized}`}
          else if (info.select_node.chinese_family_name_romanized) {rom_name = info.select_node.chinese_family_name_romanized}
          else if (info.select_node.chinese_given_name_romanized) {rom_name = info.select_node.chinese_given_name_romanized}
          else if (info.select_node.name_rom) { rom_name = info.select_node.name_rom }
          else { rom_name = translate[0]["n_a"][props.language] }

        //Set Gender
        let gender;
            if (info.select_node.gender) {
              let check = info.select_node.gender;
              if (translate[0][check.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()] === undefined) {gender = check}
              else (gender = translate[0][check.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()][props.language])
            }
            else { gender = translate[0]["n_a"][props.language] }

        //Set Nationality
        let nation;
          if (info.select_node.nationality) {
            let check = info.select_node.nationality;
            if (nationality[0][check.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()] === undefined) {nation = check}
            else (nation = nationality[0][check.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()][props.language])
          }
          else { nation = translate[0]["n_a"][props.language] }

        //Set Birth Date
        let birth;
          if (info.select_node.birth_year && info.select_node.birth_month && info.select_node.birth_day) { birth = `${info.select_node.birth_day}/${info.select_node.birth_month}/${info.select_node.birth_year}` }
          else if (info.select_node.birth_year && info.select_node.birth_month) { birth = `${info.select_node.birth_month}/${info.select_node.birth_year}` }
          else if (info.select_node.birth_year) { birth = info.select_node.birth_year }
          else { birth = translate[0]["n_a"][props.language] }

        //Set Birth Place
        let birth_place;
          if (info.select_node.birth_place) { birth_place = info.select_node.birth_place }
          else { birth_place = translate[0]["n_a"][props.language] }

        //Set Death Date
        let death;
          if (info.select_node.death_year && info.select_node.death_month && info.select_node.death_day) { death = `${info.select_node.death_day}/${info.select_node.death_month}/${info.select_node.death_year}` }
          else if (info.select_node.death_year && info.select_node.death_month) { death = `${info.select_node.death_month}/${info.select_node.death_year}` }
          else if (info.select_node.death_year) { death = info.select_node.death_year }
          else { death = translate[0]["n_a"][props.language] }

        //Set Death Place
        let death_place;
          if (info.select_node.death_place) { death_place = info.select_node.death_place }
          else { death_place = translate[0]["n_a"][props.language] }

        //Set Christian Tradition
        let trad;
          if (info.select_node.christian_tradition) {
            let check = info.select_node.christian_tradition;
            if (translate[0][check.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()] === undefined) {trad = check}
            else {trad = translate[0][check.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()][props.language]}
            }
            else {trad = translate[0]["n_a"][props.language] }

        //Set Religious Family
        let rel_fam;
          if (info.select_node.religious_family) {
            let check = info.select_node.religious_family;
            if (family_trans[0][check.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()] === undefined) {rel_fam = check}
            else {rel_fam = family_trans[0][check.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()][props.language]}
            }
            else {rel_fam = translate[0]["n_a"][props.language] }

        //Set Category
        let cat;
         if (info.select_node.corporate_entity_category) {
           let check = info.select_node.corporate_entity_category;
           if (cat_trans[0][check.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()] === undefined) {cat = check}
           else {cat = cat_trans[0][check.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()][props.language]}
           }
         else if (info.select_node.institution_category) {
           let check = info.select_node.institution_category;
           if (cat_trans[0][check.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()] === undefined) {cat = check}
           else {cat = cat_trans[0][check.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()][props.language]}
           }
         else if (info.select_node.event_category) {
           let check = info.select_node.event_category;
           if (cat_trans[0][check.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()] === undefined) {cat = check}
           else {cat = cat_trans[0][check.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()][props.language]}
           }
         else if (info.select_node.publication_category) {
          let check = info.select_node.publication_category;
          if (cat_trans[0][check.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()] === undefined) {cat = titleize(check)}
          else {cat = cat_trans[0][check.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()][props.language]}
          }
         else if (info.select_node.name_wes) {
            cat = translate[0]["geography"][props.language] 
          }
         else {cat = translate[0]["n_a"][props.language] }

        //Set Subcategory
        let subcat;
         if (info.select_node.corporate_entity_subcategory) {
           let check = info.select_node.corporate_entity_subcategory;
           if (cat_trans[0][check.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()] === undefined) {subcat = check}
           else {subcat = cat_trans[0][check.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()][props.language]}
           }
         else if (info.select_node.institution_subcategory) {
           let check = info.select_node.institution_subcategory;
           if (cat_trans[0][check.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()] === undefined) {subcat = check}
           else {subcat = cat_trans[0][check.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()][props.language]}
           }
         else if (info.select_node.event_subcategory) {
           let check = info.select_node.event_subcategory;
           if (cat_trans[0][check.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()] === undefined) {subcat = check}
           else {subcat = cat_trans[0][check.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()][props.language]}
           }
         else if (info.select_node.publication_subcategory) {
          let check = info.select_node.publication_subcategory;
          if (cat_trans[0][check.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()] === undefined) {subcat = titleize(check)}
          else {subcat = cat_trans[0][check.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()][props.language]}
          }
         else if (info.select_node.name_wes) {
          let check = info.select_kind;
          let string = check.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()
           subcat = translate[0][string][props.language] 
           }
         else {subcat = translate[0]["n_a"][props.language] }

        //Set Note
        let note;
           if (info.select_node.notes) { note = info.select_node.notes }
           else { note = translate[0]["n_a"][props.language] }

        //Set Source
        let static_source;
           if (info.select_node.source) { static_source = info.select_node.source }
           else { static_source = translate[0]["n_a"][props.language] }


        // SET REMAINING INFORMATION ////////////////////

         const selectNode = Object.entries(info.select_node)

         const filter = ['id', 'name_wes','name_rom','name_zh','given_name_western', 'family_name_western', 'name_western', 'chinese_family_name_hanzi', 'chinese_given_name_hanzi', 'chinese_name_hanzi', 'chinese_family_name_romanized', 'chinese_given_name_romanized', 'chinese_name_romanized', 'alternative_name_western', 'alternative_chinese_name_hanzi', 'alternative_chinese_name_romanized', 'notes', 'source', 'gender', 'nationality', 'birth_day', 'birth_month', 'birth_year', 'birth_place', 'death_day', 'death_month', 'death_year', 'death_place', 'christian_tradition', 'religious_family', 'corporate_entity_category', 'institution_category', 'event_category', 'publication_category', 'corporate_entity_subcategory', 'institution_subcategory', 'event_subcategory', 'publication_subcategory'];

         function titleize(str) {
          str = str.toString().toLowerCase().replace('\(','\( ').replace('\[','\[ ').split(' ');
          for (var i = 0; i < str.length; i++) {
            str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
          }
          return str.join(' ').replace('\( ','\(').replace('\[ ','\[');
         }
        
        const staticInfo = Array.from(selectNode).filter(x => !filter.includes(x[0])).map(function(node) {
           let key;
           let valueprep = node[1];
           let value;

           if (valueprep !== null){ value = titleize(valueprep)} 
           else {value = valueprep}

           let keycheck = node[0]

           if (translate[0][keycheck.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()] === undefined) {
             function titleCase(str) {
               str =  str.split('_')
               for (var i = 0; i < str.length; i++) {
                 str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
               }
               return str.join(' ');
             }
             key = titleCase(keycheck)
           }
           else {key = translate[0][keycheck.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()][props.language]}
           

           return (
             <ul className="list-group list-group-flush border border-top-0 border-right-0 border-left-0 border-bottom-1">
               <li className="list-group-item pt-0 pb-0 border-0">
                 <div className="card-body px-0 p-1 border-0">
                   <Row>
                     <Col className="text-left">{key}</Col>
                     <Col className="text-left col-9">{value}</Col>
                   </Row>
                 </div>
               </li>
             </ul>
           )
         });

         function typeCheck() {
           if (info.select_node.given_name_western) {
             return (
               <div>
                 <ul className="list-group list-group-flush border border-top-0 border-right-0 border-left-0 border-bottom-1"><li className="list-group-item pt-0 pb-0 border-0"><div className="card-body px-0 p-1 border-0">
                   <Row>
                     <Col className="text-left">{translate[0]["gender"][props.language]}</Col>
                     <Col className="text-left col-9">{gender}</Col>
                    </Row>
                  </div></li></ul>

                  <ul className="list-group list-group-flush border border-top-0 border-right-0 border-left-0 border-bottom-1"><li className="list-group-item pt-0 pb-0 border-0"><div className="card-body px-0 p-1 border-0">
                    <Row>
                      <Col className="text-left">{translate[0]["nationality"][props.language]}</Col>
                      <Col className="text-left col-9">{nation}</Col>
                     </Row>
                   </div></li></ul>

                    <ul className="list-group list-group-flush border border-top-0 border-right-0 border-left-0 border-bottom-1"><li className="list-group-item pt-0 pb-0 border-0"><div className="card-body px-0 p-1 border-0">
                     <Row>
                       <Col className="text-left">{translate[0]["birth_year"][props.language]}</Col>
                       <Col className="text-left col-9">{birth}</Col>
                      </Row>
                    </div></li></ul>

                    <ul className="list-group list-group-flush border border-top-0 border-right-0 border-left-0 border-bottom-1"><li className="list-group-item pt-0 pb-0 border-0"><div className="card-body px-0 p-1 border-0">
                      <Row>
                        <Col className="text-left">{translate[0]["death_year"][props.language]}</Col>
                        <Col className="text-left col-9">{death}</Col>
                       </Row>
                     </div></li></ul>

                     <ul className="list-group list-group-flush border border-top-0 border-right-0 border-left-0 border-bottom-1"><li className="list-group-item pt-0 pb-0 border-0"><div className="card-body px-0 p-1 border-0">
                      <Row>
                        <Col className="text-left">{translate[0]["birth_place"][props.language]}</Col>
                        <Col className="text-left col-9">{birth_place}</Col>
                       </Row>
                     </div></li></ul>

                     <ul className="list-group list-group-flush border border-top-0 border-right-0 border-left-0 border-bottom-1"><li className="list-group-item pt-0 pb-0 border-0"><div className="card-body px-0 p-1 border-0">
                       <Row>
                         <Col className="text-left">{translate[0]["death_place"][props.language]}</Col>
                         <Col className="text-left col-9">{death_place}</Col>
                        </Row>
                      </div></li></ul>
               </div>
             )
           }
           else if (info.select_node.name_wes) {
            return (
              <div>
                 <ul className="list-group list-group-flush border border-top-0 border-right-0 border-left-0 border-bottom-1"><li className="list-group-item pt-0 pb-0 border-0"><div className="card-body px-0 p-1 border-0">
                  <Row>
                    <Col className="text-left">{translate[0]["category"][props.language]}</Col>
                    <Col className="text-left col-9">{cat}</Col>
                   </Row>
                 </div></li></ul>

                 <ul className="list-group list-group-flush border border-top-0 border-right-0 border-left-0 border-bottom-1"><li className="list-group-item pt-0 pb-0 border-0"><div className="card-body px-0 p-1 border-0">
                   <Row>
                     <Col className="text-left">{translate[0]["subcategory"][props.language]}</Col>
                     <Col className="text-left col-9">{subcat}</Col>
                    </Row>
                  </div></li></ul>
                </div>
            )
          }
           else {
             return (
               <div>
                 <ul className="list-group list-group-flush border border-top-0 border-right-0 border-left-0 border-bottom-1"><li className="list-group-item pt-0 pb-0 border-0"><div className="card-body px-0 p-1 border-0">
                   <Row>
                     <Col className="text-left">{translate[0]["christian_tradition"][props.language]}</Col>
                     <Col className="text-left col-9">{trad}</Col>
                    </Row>
                  </div></li></ul>

                  <ul className="list-group list-group-flush border border-top-0 border-right-0 border-left-0 border-bottom-1"><li className="list-group-item pt-0 pb-0 border-0"><div className="card-body px-0 p-1 border-0">
                    <Row>
                      <Col className="text-left">{translate[0]["religious_family"][props.language]}</Col>
                      <Col className="text-left col-9">{rel_fam}</Col>
                     </Row>
                   </div></li></ul>

                  <ul className="list-group list-group-flush border border-top-0 border-right-0 border-left-0 border-bottom-1"><li className="list-group-item pt-0 pb-0 border-0"><div className="card-body px-0 p-1 border-0">
                   <Row>
                     <Col className="text-left">{translate[0]["category"][props.language]}</Col>
                     <Col className="text-left col-9">{cat}</Col>
                    </Row>
                  </div></li></ul>

                  <ul className="list-group list-group-flush border border-top-0 border-right-0 border-left-0 border-bottom-1"><li className="list-group-item pt-0 pb-0 border-0"><div className="card-body px-0 p-1 border-0">
                    <Row>
                      <Col className="text-left">{translate[0]["subcategory"][props.language]}</Col>
                      <Col className="text-left col-9">{subcat}</Col>
                     </Row>
                   </div></li></ul>
                 </div>
             )
           }
        };

        function pubCheck(i,p) {
          let name;
          if (info.select_node.publication_category) {
            name = translate[0][i][props.language]
          } else {
            name = translate[0][p][props.language]
          }
          return ( name )
        }

         return (
          <div className="pb-3">
             <Row><Col>
               <h1 className="popup_title" >{name} </h1>
               {props.linkCheck(props, info)}
               <ButtonExportExcel data={all} filename='export'>
                  <FaRegFileExcel className="link-icons" data-tip data-for="all_rels"/> 
                  <ReactTooltip id="all_rels" place="bottom" effect="solid">{translate[0]["download_all_data"][props.language]}</ReactTooltip>
              </ButtonExportExcel>
              <FaLink 
                className="ms-3 link-icons" 
                data-tip data-for="permalink"
                onClick={() => { 
                  const message = translate[0]["permalink_copied"][props.language];
                  navigator.clipboard.writeText(window.location.origin + '/search?nodeSelect='+ props.nodeSelect);
                  alert.show(message);
                }}
                />
                <ReactTooltip id="permalink" place="bottom" effect="solid">{translate[0]["permalink"][props.language]}</ReactTooltip>
                <FaQuoteRight 
                  className="link-icons" 
                  data-tip data-for="cite"
                  onClick={() => { 
                    const link = window.location.origin + '/search?nodeSelect='+ props.nodeSelect;
                    const title = name;
                    const message = props.getCitation(title, link);
                    const header = translate[0]["citation"][props.language]
                    alert.show(message, { closeCopy: 'X', title: header });
                  }}
                  />
                <ReactTooltip id="cite" place="bottom" effect="solid">{translate[0]["citation"][props.language]}</ReactTooltip>
            </Col></Row>
            <h2 className="popup_section_head mt-2">{translate[0]["additional_info_title"][props.language]}
            <Button className="btn btn-sm btn-danger mx-2" data-prop="addinfo" onClick={(i) =>  props.toggleDisplay(i)} role="button" >{translate[0][props.addinfortext][props.language]}</Button>
            <CsvDownloadButton delimiter="*" data={basic} style={{borderWidth:'0px', width:'0px', padding:'0px'}}> 
              <BiDownload className="download-icons" data-tip data-for="basic"/> 
              <ReactTooltip id="basic" place="bottom" effect="solid">{translate[0]["download_basic_data"][props.language]}</ReactTooltip>
            </CsvDownloadButton>
            </h2>
             <div className={`animate__animated animate__fadeInDown `+props.addinfo}>
                 <div className="card mt-2">

                 <div className="popup_card_header card-header">
                   <Row>
                     <Col className="text-left">{translate[0]["type"][props.language]}</Col>
                     <Col className="text-left col-9">{translate[0]["information"][props.language]}</Col>
                   </Row>
                 </div>

                 <ul className="list-group list-group-flush border border-top-0 border-right-0 border-left-0 border-bottom-1"><li className="list-group-item pt-0 pb-0 border-0"><div className="card-body px-0 p-1 border-0">
                   <Row>
                     <Col className="text-left">ID</Col>
                     <Col className="text-left col-9">{info.select_node.id}</Col>
                    </Row>
                  </div></li></ul>

                  <ul className="list-group list-group-flush border border-top-0 border-right-0 border-left-0 border-bottom-1"><li className="list-group-item pt-0 pb-0 border-0"><div className="card-body px-0 p-1 border-0">
                   <Row>
                     <Col className="text-left">{pubCheck("pub_title_wes", "western_name")}</Col>
                     <Col className="text-left col-9">{wes_name}</Col>
                    </Row>
                  </div></li></ul>

                  <ul className="list-group list-group-flush border border-top-0 border-right-0 border-left-0 border-bottom-1"><li className="list-group-item pt-0 pb-0 border-0"><div className="card-body px-0 p-1 border-0">
                   <Row>
                     <Col className="text-left">{pubCheck("alt_pub_title_wes", "alternate_western_names")}</Col>
                     <Col className="text-left col-9">{alt_wes_name}</Col>
                    </Row>
                  </div></li></ul>

                  <ul className="list-group list-group-flush border border-top-0 border-right-0 border-left-0 border-bottom-1"><li className="list-group-item pt-0 pb-0 border-0"><div className="card-body px-0 p-1 border-0">
                   <Row>
                     <Col className="text-left">{pubCheck("pub_title_zh", "chinese_name")}</Col>
                     <Col className="text-left col-9">{hanzi_name}</Col>
                    </Row>
                  </div></li></ul>

                  <ul className="list-group list-group-flush border border-top-0 border-right-0 border-left-0 border-bottom-1"><li className="list-group-item pt-0 pb-0 border-0"><div className="card-body px-0 p-1 border-0">
                    <Row>
                      <Col className="text-left">{pubCheck("pub_title_rom", "chinese_name_romanization")}</Col>
                      <Col className="text-left col-9">{rom_name}</Col>
                     </Row>
                   </div></li></ul>

                   {typeCheck()}

                   {staticInfo}

                   <ul className="list-group list-group-flush border border-top-0 border-right-0 border-left-0 border-bottom-1"><li className="list-group-item pt-0 pb-0 border-0"><div className="card-body px-0 p-1 border-0">
                     <Row>
                       <Col className="text-left">{translate[0]["note"][props.language]}</Col>
                       <Col className="text-left col-9">{note}</Col>
                      </Row>
                    </div></li></ul>

                    <ul className="list-group list-group-flush border border-top-0 border-right-0 border-left-0 border-bottom-1"><li className="list-group-item pt-0 pb-0 border-0"><div className="card-body px-0 p-1 border-0">
                      <Row>
                        <Col className="text-left">{translate[0]["sources"][props.language]}</Col>
                        <Col className="text-left col-9">{static_source}</Col>
                       </Row>
                     </div></li></ul>
                 </div>
             </div>
           </div>
       )
    }
  };

// BREADCRUMB CONSTRUCTOR ///////////////////////////////////////////////////////////////////////////////
  const breadLine = () => {
    const getCurrent = () => {
       if (props.selectArray.length > 0) {
         const info = props.selectArray[0]
         if (info.select_node.given_name_western) {
           if ((props.language == "zh" || props.language == "tw") && info.select_node.chinese_given_name_hanzi && info.select_node.chinese_family_name_hanzi) {return (<span className="ms-1"><span className="small">`{info.select_node.chinese_family_name_hanzi}, {info.select_node.chinese_given_name_hanzi}</span></span>)}
           else if ((props.language == "zh" || props.language == "tw") && info.select_node.chinese_given_name_hanzi) {return (<span className="ms-1"><span className="small">`{info.select_node.chinese_family_name_hanzi}, {info.select_node.given_name_western}</span></span>)}
           else {return (<span className="ms-1"><span className="small">{info.select_node.family_name_western}, {info.select_node.given_name_western}</span></span>)}
         }
         else if (info.select_node.name_wes) {
          if (props.language == "zh" || props.language == "tw") {return (<span><span className="small">{info.select_node.name_zh}</span></span>)}
          else {return (<span className="ms-1"><span className="small">{info.select_node.name_wes}</span></span>)}
        }
        else {
           if (props.language == "zh" || props.language == "tw") {return (<span><span className="small">{info.select_node.chinese_name_hanzi}</span></span>)}
           else {return (<span className="ms-1"><span className="small">{info.select_node.name_western}</span></span>)}
         }
       } else {}
     }
     const ellipse  = () => {
       const measure = props.breadCrumb
       if (measure.length > 4) {return (<span className="small" >... /  </span>)}
       else {}
     }
    const breadList = props.breadCrumb
    if (breadList.length > 1 ) {
      const bread = breadList.map(function(crumb, i) {
        if (breadList.length - 1 === i) {}
        else if (crumb.family_name_western && (breadList.length - i) < 5){
          if ((props.language == "zh" || props.language == "tw") && crumb.chinese_given_name_hanzi ) {
            return (<span className="ms-1"><span className="small breadcrumb_link" onClick={() =>  props.selectSwitchReduce((crumb.key), (crumb.order))}>{crumb.chinese_family_name_hanzi}{crumb.chinese_given_name_hanzi}</span> /  </span>)
          } else {return (<span className="ms-1"><span className="small breadcrumb_link" onClick={() =>  props.selectSwitchReduce((crumb.key), (crumb.order))}>{crumb.family_name_western}, {crumb.given_name_western}</span> /  </span>)}
        }
        else if (crumb.name_western && (breadList.length - i) < 5){
          if ((props.language == "zh" || props.language == "tw") && crumb.chinese_name_hanzi ) {
            return (<span className="ms-1"><span className="small breadcrumb_link" onClick={() =>  props.selectSwitchReduce((crumb.key), (crumb.order))}>{crumb.chinese_name_hanzi}</span> /  </span>)
          } else {return (<span className="ms-1"><span className="small breadcrumb_link" onClick={() =>  props.selectSwitchReduce((crumb.key), (crumb.order))}>{crumb.name_western}</span> /  </span>)}
        }
        else if (crumb.name_wes && (breadList.length - i) < 5){
          if ((props.language == "zh" || props.language == "tw") && crumb.name_zh ) {
            return (<span className="ms-1"><span className="small breadcrumb_link" onClick={() =>  props.selectSwitchReduce((crumb.key), (crumb.order))}>{crumb.name_zh}</span> /  </span>)
          } else {return (<span className="ms-1"><span className="small breadcrumb_link" onClick={() =>  props.selectSwitchReduce((crumb.key), (crumb.order))}>{crumb.name_wes}</span> /  </span>)}
        }
        else {}
      })
      return (<div className="breadcrumb pt-1 px-2">{ellipse()} {bread} {getCurrent()}</div>)
    } else {}
  };

// RETURN ///////////////////////////////////////////////////////////////////////////////////////////////
  return (
    <div>
        <div className={'rounded-top border-1 border-bottom-0 p-2 top-' + props.popupcontainer} style={{border: 'solid 1px #a9a9a9'}}>
            <BsX className="popup_close" data-prop="popupcontainer" onClick={(i) =>  props.toggleDisplay(i)}/>
            {breadLine()}
        </div>
        <div className={'border-1 border-top-0 rounded-bottom ' + props.popupcontainer} style={{border: 'solid 1px #a9a9a9'}}>
          <div className="popupbody">
            {getInfo()}
            {getPersRels()}
            {getInstRels()}
            {getCorpRels()}
            {getEventRels()}
            {getPubRels()}
          </div>
        </div>
    </div>
  )
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
// EXPORT //////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

export default Popup
