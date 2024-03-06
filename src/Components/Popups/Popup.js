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
import { useState } from 'react'
import '../../Styles/Css/popup.css'
import credentials from "../../credentials.json"

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
  const geoTypes = ["Village", "Township", "Country", "Prefecture", "Province", "Nation"];
  //const printGeo = print.filter(i => geoTypes.includes(i.end_type));
  const printGeo = print.filter(i => i.end_type === "Geography");

  // Setting up reporting error
  const [reportFormVisible, setReportFormVisible] = useState(false);
  const [reportText, setReportText] = useState('');
  const [reporterName, setName] = useState('');
  const [reporterEmail, setEmail] = useState('');

  const { Octokit } = require('@octokit/rest');
  const fs = require('fs').promises;

  const updateFileInGitHub = async (data) => {
    try {
      const octokit = new Octokit({
        auth: credentials.git_auth,
      });

      const owner = credentials.git_owner;
      const repo = credentials.git_repo;
      const path = credentials.git_path;

      // Retrieve the current content of the file
      const { data: currentContent } = await octokit.repos.getContent({
        owner,
        repo,
        path,
      });

      // Decode the current content from base64
      const decodedContent = Buffer.from(currentContent.content, 'base64').toString('utf-8');

      // Modify the content
      const newData = `${decodedContent}\n${data.date}|${data.report}|${data.reporterName}|${data.reporterEmail}|${props.nodeSelect}`;

      // Encode the new content to base64
      const newContentBase64 = Buffer.from(newData).toString('base64');

      // Update the file
      await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message: 'Update file via API', // Commit message
        content: newContentBase64,
        sha: currentContent.sha, // SHA of the current content, to ensure you're updating the latest version
      });

      console.log('Data added to GitHub file successfully!');
      return true;
    } catch (error) {
      // Log detailed error information
      console.error('Error updating file in GitHub:', error.message);
      console.error('GitHub API response:', error.response?.data || 'No response data');

      // Optionally, log the stack trace for further debugging
      console.error('Stack trace:', error.stack);

      return false;
    }
  };

  const handleReportButtonClick = () => {
    // Toggle the visibility of the report form
    setReportFormVisible(!reportFormVisible);
  };

  const handleReportSubmit = async () => {
    // Check if all three fields have at least one character
    if (reportText.trim().length === 0 || reporterName.trim().length === 0 || reporterEmail.trim().length === 0) {
      // If any field is empty, display an alert or handle it as needed
      window.alert(translate[0]["unfilled_fields"][props.language]);
      return;
    }

    try {
      // Send report to the backend
      const errorReported = await updateFileInGitHub({
        date: new Date().toISOString(),
        report: reportText,
        reporterName: reporterName,
        reporterEmail: reporterEmail
      });

      // Display confirmation message to the user
      if (errorReported) {
        window.alert(translate[0]['issue_reported_successfully'][props.language]);
      } else {
        window.alert(translate[0]['issue_not_reported_successfully'][props.language]);
      }

      setReportFormVisible(false);
      setReportText('');
      setName('');
      setEmail('');
    } catch (error) {
      console.error('Error handling report submission:', error);
    }
  };
 
  function titleize(str) {
    str = str.toString().toLowerCase().replace('\(', '\( ').replace('\[', '\[ ').split(' ');
    for (var i = 0; i < str.length; i++) {
      str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(' ').replace('\( ', '\(').replace('\[ ', '\[');
  }
  
  function sourceCheck(node) {
    if (node.rel.source) 
      return (<li className="card_sources list-group-item px-3 pt-0 pb-1 border-0 border-bottom-1"><span className="popup_card_header sources">{translate[0]["sources"][props.language]}:</span> {node.rel.source}</li>)
  }

  function noteCheck(node) {
    if (node.rel.notes) 
      return (<li className="card_sources list-group-item px-3 pt-0 pb-1 border-0 border-bottom-1"><span className="popup_card_header sources">{translate[0]["note"][props.language]}:</span> {node.rel.notes}</li>)
  }

  function dateCheck(node){
    let datecheck;
    if (node.rel.start_year && node.rel.end_year) { datecheck = node.rel.start_year + "-" + node.rel.end_year }
        else if (node.rel.start_year) { datecheck = node.rel.start_year }
        else if (node.rel.end_year) { datecheck = node.rel.start_year }
        else { datecheck = "Unknown" }
    return datecheck;
  }

  // GROUPS RELS BY ID ///
  const groupRelsById = (relList, nodeType) => {
    // group the list into a dictionary based on person ID (one dictionary entry per person ID)
    let restructuredData = {};
    relList.forEach(node => {
      let key2Value = node.key2;
      if (restructuredData.hasOwnProperty(key2Value)) {
        restructuredData[key2Value].push(node);
      } else {
        restructuredData[key2Value] = [node];
      }
    });

    const sortedRelList = Object.keys(restructuredData).map(key => {
      let nodeList = restructuredData[key];
      let first = true;
      const keyList = nodeList.sort((a, b) => {
        const yearA = a.rel.start_year || 0;
        const yearB = b.rel.start_year || 0;
        return yearA - yearB;
      })
      .map(function (node) {
        let source = sourceCheck(node)        
        let note = noteCheck(node)

        let rel_name;
        if (first) {
          switch (nodeType) {
            case "Person":
              if ((props.language == "zh" || props.language == "tw") && node.node2.chinese_family_name_hanzi && node.node2.chinese_given_name_hanzi) { rel_name = `${node.node2.chinese_family_name_hanzi} ${node.node2.chinese_given_name_hanzi}` }
              if ((props.language == "zh" || props.language == "tw") && node.node2.chinese_family_name_hanzi) { rel_name = `${node.node2.chinese_family_name_hanzi} ${node.node2.given_name_western}` }
              else { rel_name = `${node.node2.given_name_western} ${node.node2.family_name_western}` }
              break;
            case "Institution":
            case "CorporateEntity":
            case "Event":
            case "Publication":
              if ((props.language == "zh" || props.language == "tw") && node.node2.chinese_name_hanzi) { rel_name = node.node2.chinese_name_hanzi }
              else { rel_name = node.node2.name_western }
              break;
            case "Geography":
              rel_name = `${node.node2.name_zh} (${node.node2.name_wes})`
              break;
          }
          first = false;
        }

        let rel;
        if (node.rel.rel_type) { rel = node.rel.rel_type }
        else { rel = "N/A" }

        let relcheck;
        if (relationships[0][rel.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()] === undefined) { relcheck = titleize(rel) }
        else { relcheck = relationships[0][rel.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()][props.language] }

        let datecheck = dateCheck(node);
        
        return (
          <Row>
            <Col className="text-left">
              {nodeType !== "Geography" ? (
                <span className="popup_link" onClick={() => props.selectSwitchAppend(node.key2)}>
                  {rel_name}
                </span>
              ) : (
                <span>{rel_name}</span>
              )}
            </Col>
            <Col className="text-left">{relcheck}
              <span className='light-gray-text'>{source}{note}</span></Col>
            <Col className="text-end">{datecheck}</Col>
          </Row>
        )
      });

      return (
        <ul className="list-group list-group-flush border border-top-0 border-right-0 border-left-0 border-bottom-1">
          <li className="list-group-item pt-0 pb-0 border-0">
            <div className="card-body px-0 p-1 border-0">
              {keyList}
            </div>
          </li>
        </ul>
      )
    });

    return sortedRelList;
  }

  const displayRelList = (relList, relListType) => {
    let section_title, data_prop, button_text, data_for, download_text, print_info, props_class;
    let columnHeaders = [
        { label: translate[0]["name"][props.language], align: "text-left" },
        { label: translate[0]["relationship"][props.language], align: "text-left" },
        { label: translate[0]["years"][props.language], align: "text-end" }
      ];

    switch(relListType){
      case "Person":
        section_title = translate[0]["pers_relationships"][props.language];
        data_prop = "addpers"
        button_text = translate[0][props.addperstext][props.language];
        data_for = "pers_rels";
        download_text = translate[0]["download_pers_rels"][props.language];
        print_info = printPers;
        props_class = props.addpers;
        break;
      case "Institution":
        section_title = translate[0]["inst_relationships"][props.language];
        data_prop = "addinst"
        button_text = translate[0][props.addinsttext][props.language];
        data_for = "inst_rels";
        download_text = translate[0]["download_inst_rels"][props.language];
        print_info = printInst;
        props_class = props.addinst;
        break;
      case "CorporateEntity":
        section_title = translate[0]["corp_relationships"][props.language];
        data_prop = "addcorp"
        button_text = translate[0][props.addcorptext][props.language];
        data_for = "corp_rels";
        download_text = translate[0]["download_corp_rels"][props.language];
        print_info = printCorp;
        props_class = props.addcorp;
        break;
      case "Event":
        section_title = translate[0]["event_relationships"][props.language];
        data_prop = "addevent"
        button_text = translate[0][props.addeventtext][props.language];
        data_for = "event_rels";
        download_text = translate[0]["download_event_rels"][props.language];
        print_info = printEvent;
        props_class = props.addevent;
        break;
      case "Publication":
        section_title = translate[0]["publication_relationships"][props.language];
        data_prop = "addpub"
        button_text = translate[0][props.addpubtext][props.language];
        data_for = "pub_rels";
        download_text = translate[0]["download_pub_rels"][props.language];
        print_info = printPub;
        props_class = props.addpub;
        break;
      case "Geography":
        section_title = translate[0]["geography_relationships"][props.language];
        data_prop = "addgeo"
        button_text = translate[0][props.addgeotext][props.language];
        data_for = "geo_rels";
        download_text = translate[0]["download_geo_rels"][props.language];
        print_info = printGeo;
        props_class = props.addgeo;
        break;
    }
    
    return (
      <div>
        <div className="pb-3">
          <h2 className="popup_section_head mt-2">{section_title}
            <Button className="btn btn-sm btn-danger mx-2" data-prop={data_prop} onClick={(i) => props.toggleDisplay(i)} role="button" >{button_text}</Button>
            <CsvDownloadButton delimiter="*" data={print_info} style={{ borderWidth: '0px', width: '0px', padding: '0px' }}>
              <BiDownload className="download-icons" data-tip data-for={data_for} />
              <ReactTooltip id={data_for} place="bottom" effect="solid">{download_text}</ReactTooltip>
            </CsvDownloadButton>
          </h2>
          <div className={props_class + ' card'}>
            <div className="popup_card_header card-header bg-light">
              <Row>
                {columnHeaders.map((header, index) => (<Col key={index} className={header.align}>{header.label}</Col>))}
              </Row>
            </div>
            {relList}
          </div>
        </div>
      </div>
    )
  }

  // PEOPLE RELATIONSHIPS CONSTRUCTOR ///////////////////////////////////////////////////////////////////////////////
  const getPersRels = () => {
    const persRels = props.selectArray.filter(type => type.rel_kind === "Person")
    if (persRels.length > 0) {
      const sortedPersRels = groupRelsById(persRels, "Person")
      return displayRelList(sortedPersRels, "Person")
    } else { }
  };

  // INSTITUTION RELATIONSHIPS CONSTRUCTOR ///////////////////////////////////////////////////////////////////////////////
  const getInstRels = () => {
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
      const sortedInstRels = groupRelsById(instRels, "Institution");
      return displayRelList(sortedInstRels, "Institution");
    } else { }
  };

  // CORPORATE ENTITY RELATIONSHIPS CONSTRUCTOR ///////////////////////////////////////////////////////////////////////////////
  const getCorpRels = () => {
    const corpRels = props.selectArray
      .filter(type => type.rel_kind === "CorporateEntity")
    if (corpRels.length > 0) {
      const sortedCorpRels = groupRelsById(corpRels, "CorporateEntity");
      return displayRelList(sortedCorpRels, "CorporateEntity");
    } else { }
  };

  // EVENT RELATIONSHIPS CONSTRUCTOR ///////////////////////////////////////////////////////////////////////////////
  const getEventRels = () => {
    const eventRels = props.selectArray.filter(type => type.rel_kind === "Event")
    if (eventRels.length > 0) {
      const sortedEventRels = groupRelsById(eventRels, "Event");
      return displayRelList(sortedEventRels, "Event");
    } else { }
  };

  // PUBLICATION RELATIONSHIPS CONSTRUCTOR ///////////////////////////////////////////////////////////////////////////////
  const getPubRels = () => {
    const pubRels = props.selectArray.filter(type => type.rel_kind === "Publication")
    if (pubRels.length > 0) {
      const sortedPubRels = groupRelsById(pubRels, "Publication");
      return displayRelList(sortedPubRels, "Publication");
    } else { }
  };

  // PUBLICATION RELATIONSHIPS CONSTRUCTOR ///////////////////////////////////////////////////////////////////////////////
  const getGeoRels = () => {
    const geoRels = props.selectArray.filter(type => type.rel_kind === "Geography")
    if (geoRels.length > 0) {
      const sortedGeoRels = groupRelsById(geoRels, "Geography");
      return displayRelList(sortedGeoRels, "Geography");
    } else { }
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
        else { name = `${info.select_node.given_name_western} ${info.select_node.family_name_western}` }
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
      if (info.select_node.given_name_western) { wes_name = `${info.select_node.given_name_western} ${info.select_node.family_name_western}` }
      else if (info.select_node.name_western) { wes_name = info.select_node.name_western }
      else if (info.select_node.name_wes) { wes_name = info.select_node.name_wes };

      //Set Alternative Western Name
      let alt_wes_name;
      if (info.select_node.alternative_name_western) { alt_wes_name = `${info.select_node.alternative_name_western} ${info.select_node.alternative_name_western}` }
      else { alt_wes_name = translate[0]["n_a"][props.language] };

      //Set Hanzi Name
      let hanzi_name;
      if (info.select_node.chinese_family_name_hanzi && info.select_node.chinese_given_name_hanzi) { hanzi_name = `${info.select_node.chinese_family_name_hanzi} ${info.select_node.chinese_given_name_hanzi}` }
      else if (info.select_node.chinese_family_name_hanzi) { hanzi_name = info.select_node.chinese_family_name_hanzi }
      else if (info.select_node.chinese_given_name_hanzi) { hanzi_name = info.select_node.chinese_given_name_hanzi }
      else if (info.select_node.chinese_name_hanzi) { hanzi_name = info.select_node.chinese_name_hanzi }
      else if (info.select_node.name_zh) { hanzi_name = info.select_node.name_zh }
      else { hanzi_name = translate[0]["n_a"][props.language] }

      //Set Romanized Name
      let rom_name;
      if (info.select_node.chinese_family_name_romanized && info.select_node.chinese_given_name_romanized) { rom_name = `${info.select_node.chinese_family_name_romanized} ${info.select_node.chinese_given_name_romanized}` }
      else if (info.select_node.chinese_family_name_romanized) { rom_name = info.select_node.chinese_family_name_romanized }
      else if (info.select_node.chinese_given_name_romanized) { rom_name = info.select_node.chinese_given_name_romanized }
      else if (info.select_node.name_rom) { rom_name = info.select_node.name_rom }
      else { rom_name = translate[0]["n_a"][props.language] }

      //Set Gender
      let gender;
      if (info.select_node.gender) {
        let check = info.select_node.gender;
        if (translate[0][check.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()] === undefined) { gender = check }
        else (gender = translate[0][check.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()][props.language])
      }
      else { gender = translate[0]["n_a"][props.language] }

      //Set Nationality
      let nation;
      if (info.select_node.nationality) {
        let check = info.select_node.nationality;
        if (nationality[0][check.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()] === undefined) { nation = check }
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
        if (translate[0][check.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()] === undefined) { trad = check }
        else { trad = translate[0][check.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()][props.language] }
      }
      else { trad = translate[0]["n_a"][props.language] }

      //Set Religious Family
      let rel_fam;
      if (info.select_node.religious_family) {
        let check = info.select_node.religious_family;
        if (family_trans[0][check.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()] === undefined) { rel_fam = check }
        else { rel_fam = family_trans[0][check.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()][props.language] }
      }
      else { rel_fam = translate[0]["n_a"][props.language] }

      //Set Category
      let cat;
      if (info.select_node.corporate_entity_category) {
        let check = info.select_node.corporate_entity_category;
        if (cat_trans[0][check.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()] === undefined) { cat = check }
        else { cat = cat_trans[0][check.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()][props.language] }
      }
      else if (info.select_node.institution_category) {
        let check = info.select_node.institution_category;
        if (cat_trans[0][check.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()] === undefined) { cat = check }
        else { cat = cat_trans[0][check.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()][props.language] }
      }
      else if (info.select_node.event_category) {
        let check = info.select_node.event_category;
        if (cat_trans[0][check.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()] === undefined) { cat = check }
        else { cat = cat_trans[0][check.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()][props.language] }
      }
      else if (info.select_node.publication_category) {
        let check = info.select_node.publication_category;
        if (cat_trans[0][check.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()] === undefined) { cat = titleize(check) }
        else { cat = cat_trans[0][check.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()][props.language] }
      }
      else if (info.select_node.name_wes) {
        cat = translate[0]["geography"][props.language]
      }
      else { cat = translate[0]["n_a"][props.language] }

      //Set Subcategory
      let subcat;
      if (info.select_node.corporate_entity_subcategory) {
        let check = info.select_node.corporate_entity_subcategory;
        if (cat_trans[0][check.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()] === undefined) { subcat = check }
        else { subcat = cat_trans[0][check.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()][props.language] }
      }
      else if (info.select_node.institution_subcategory) {
        let check = info.select_node.institution_subcategory;
        if (cat_trans[0][check.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()] === undefined) { subcat = check }
        else { subcat = cat_trans[0][check.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()][props.language] }
      }
      else if (info.select_node.event_subcategory) {
        let check = info.select_node.event_subcategory;
        if (cat_trans[0][check.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()] === undefined) { subcat = check }
        else { subcat = cat_trans[0][check.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()][props.language] }
      }
      else if (info.select_node.publication_subcategory) {
        let check = info.select_node.publication_subcategory;
        if (cat_trans[0][check.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()] === undefined) { subcat = titleize(check) }
        else { subcat = cat_trans[0][check.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()][props.language] }
      }
      else if (info.select_node.name_wes) {
        let check = info.select_kind;
        let string = check.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()
        subcat = translate[0][string][props.language]
      }
      else { subcat = translate[0]["n_a"][props.language] }

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

      const filter = ['id', 'name_wes', 'name_rom', 'name_zh', 'given_name_western', 'family_name_western', 'name_western', 'chinese_family_name_hanzi', 'chinese_given_name_hanzi', 'chinese_name_hanzi', 'chinese_family_name_romanized', 'chinese_given_name_romanized', 'chinese_name_romanized', 'alternative_name_western', 'alternative_chinese_name_hanzi', 'alternative_chinese_name_romanized', 'notes', 'source', 'gender', 'nationality', 'birth_day', 'birth_month', 'birth_year', 'birth_place', 'death_day', 'death_month', 'death_year', 'death_place', 'christian_tradition', 'religious_family', 'corporate_entity_category', 'institution_category', 'event_category', 'publication_category', 'corporate_entity_subcategory', 'institution_subcategory', 'event_subcategory', 'publication_subcategory'];

      const staticInfo = Array.from(selectNode).filter(x => !filter.includes(x[0])).map(function (node) {
        let key;
        let valueprep = node[1];
        let value;

        if (valueprep !== null) { value = titleize(valueprep) }
        else { value = valueprep }

        let keycheck = node[0]

        if (translate[0][keycheck.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()] === undefined) {
          function titleCase(str) {
            str = str.split('_')
            for (var i = 0; i < str.length; i++) {
              str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
            }
            return str.join(' ');
          }
          key = titleCase(keycheck)
        }
        else { key = translate[0][keycheck.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()][props.language] }

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

      function pubCheck(i, p) {
        let name;
        if (info.select_node.publication_category) {
          name = translate[0][i][props.language]
        } else {
          name = translate[0][p][props.language]
        }
        return (name)
      }

      return (
        <div className="pb-3">
          <Row><Col>
            <h1 className="popup_title" >{name} </h1>
            {props.linkCheck(props, info)}
            <ButtonExportExcel data={all} filename='export'>
              <FaRegFileExcel className="link-icons" data-tip data-for="all_rels" />
              <ReactTooltip id="all_rels" place="bottom" effect="solid">{translate[0]["download_all_data"][props.language]}</ReactTooltip>
            </ButtonExportExcel>
            <FaLink
              className="ms-3 link-icons"
              data-tip data-for="permalink"
              onClick={() => {
                const message = translate[0]["permalink_copied"][props.language];
                navigator.clipboard.writeText(window.location.origin + '/search?nodeSelect=' + props.nodeSelect);
                alert.show(message);
              }}
            />
            <ReactTooltip id="permalink" place="bottom" effect="solid">{translate[0]["permalink"][props.language]}</ReactTooltip>
            <FaQuoteRight
              className="link-icons"
              data-tip data-for="cite"
              onClick={() => {
                const link = window.location.origin + '/search?nodeSelect=' + props.nodeSelect;
                const title = name;
                const message = props.getCitation(title, link);
                const header = translate[0]["citation"][props.language]
                alert.show(message, { closeCopy: 'X', title: header });
              }}
            />
            <ReactTooltip id="cite" place="bottom" effect="solid">{translate[0]["citation"][props.language]}</ReactTooltip>
            {/* Report Data Error Button */}
              <button className="btn btn-sm btn-danger mx-5" role="button" onClick={handleReportButtonClick}>{translate[0]["report_data_error"][props.language]}</button>
              {/* Report Form/Modal */}
              {reportFormVisible && (
                <div className = "report-modal text-left">
                  {/* Header for the error report box */}
                  <h6 className='text-left'>{translate[0]['describe_error'][props.language]}</h6>
                  {/* Text area for user input */}
                  <textarea
                    value={reportText}
                    onChange={(e) => setReportText(e.target.value)}
                    placeholder={translate[0]['describe_data_error'][props.language]}
                    rows={5}
                  />
                  {/* Name input field */}
                  <input
                    type="text"
                    value={reporterName}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={translate[0]['your_name'][props.language]}
                    style={{ marginBottom: '10px', marginRight: '10px'}}
                  />
                  {/* Email input field */}
                  <input
                    type="email"
                    value={reporterEmail}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={translate[0]['your_email'][props.language]}
                    style={{ marginBottom: '10px', marginRight: '10px'}}
                  />
                  {/* Submit button for the report */}
                  <button className="btn btn-danger btn-sm" onClick={handleReportSubmit}>{translate[0]['submit'][props.language]}</button>
                </div>
              )}
          </Col></Row>
          <h2 className="popup_section_head mt-2">{translate[0]["additional_info_title"][props.language]}
            <Button className="btn btn-sm btn-danger mx-2" data-prop="addinfo" onClick={(i) => props.toggleDisplay(i)} role="button" >{translate[0][props.addinfortext][props.language]}</Button>
            <CsvDownloadButton delimiter="*" data={basic} style={{ borderWidth: '0px', width: '0px', padding: '0px' }}>
              <BiDownload className="download-icons" data-tip data-for="basic" />
              <ReactTooltip id="basic" place="bottom" effect="solid">{translate[0]["download_basic_data"][props.language]}</ReactTooltip>
            </CsvDownloadButton>
          </h2>
          <div className={`animate__animated animate__fadeInDown ` + props.addinfo}>
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
          if ((props.language == "zh" || props.language == "tw") && info.select_node.chinese_given_name_hanzi && info.select_node.chinese_family_name_hanzi) { return (<span className="ms-1"><span className="small">`{info.select_node.chinese_family_name_hanzi}, {info.select_node.chinese_given_name_hanzi}</span></span>) }
          else if ((props.language == "zh" || props.language == "tw") && info.select_node.chinese_given_name_hanzi) { return (<span className="ms-1"><span className="small">`{info.select_node.chinese_family_name_hanzi}, {info.select_node.given_name_western}</span></span>) }
          else { return (<span className="ms-1"><span className="small">{info.select_node.family_name_western}, {info.select_node.given_name_western}</span></span>) }
        }
        else if (info.select_node.name_wes) {
          if (props.language == "zh" || props.language == "tw") { return (<span><span className="small">{info.select_node.name_zh}</span></span>) }
          else { return (<span className="ms-1"><span className="small">{info.select_node.name_wes}</span></span>) }
        }
        else {
          if (props.language == "zh" || props.language == "tw") { return (<span><span className="small">{info.select_node.chinese_name_hanzi}</span></span>) }
          else { return (<span className="ms-1"><span className="small">{info.select_node.name_western}</span></span>) }
        }
      } else { }
    }
    const ellipse = () => {
      const measure = props.breadCrumb
      if (measure.length > 4) { return (<span className="small" >... /  </span>) }
      else { }
    }
    const breadList = props.breadCrumb
    if (breadList.length > 1) {
      const bread = breadList.map(function (crumb, i) {
        if (breadList.length - 1 === i) { }
        else if (crumb.family_name_western && (breadList.length - i) < 5) {
          if ((props.language == "zh" || props.language == "tw") && crumb.chinese_given_name_hanzi) {
            return (<span className="ms-1"><span className="small breadcrumb_link" onClick={() => props.selectSwitchReduce((crumb.key), (crumb.order))}>{crumb.chinese_family_name_hanzi}{crumb.chinese_given_name_hanzi}</span> /  </span>)
          } else { return (<span className="ms-1"><span className="small breadcrumb_link" onClick={() => props.selectSwitchReduce((crumb.key), (crumb.order))}>{crumb.family_name_western}, {crumb.given_name_western}</span> /  </span>) }
        }
        else if (crumb.name_western && (breadList.length - i) < 5) {
          if ((props.language == "zh" || props.language == "tw") && crumb.chinese_name_hanzi) {
            return (<span className="ms-1"><span className="small breadcrumb_link" onClick={() => props.selectSwitchReduce((crumb.key), (crumb.order))}>{crumb.chinese_name_hanzi}</span> /  </span>)
          } else { return (<span className="ms-1"><span className="small breadcrumb_link" onClick={() => props.selectSwitchReduce((crumb.key), (crumb.order))}>{crumb.name_western}</span> /  </span>) }
        }
        else if (crumb.name_wes && (breadList.length - i) < 5) {
          if ((props.language == "zh" || props.language == "tw") && crumb.name_zh) {
            return (<span className="ms-1"><span className="small breadcrumb_link" onClick={() => props.selectSwitchReduce((crumb.key), (crumb.order))}>{crumb.name_zh}</span> /  </span>)
          } else { return (<span className="ms-1"><span className="small breadcrumb_link" onClick={() => props.selectSwitchReduce((crumb.key), (crumb.order))}>{crumb.name_wes}</span> /  </span>) }
        }
        else { }
      })
      return (<div className="breadcrumb pt-1 px-2">{ellipse()} {bread} {getCurrent()}</div>)
    } else { }
  };

  // RETURN ///////////////////////////////////////////////////////////////////////////////////////////////
  return (
    <div>
      <div className={'rounded-top border-1 border-bottom-0 p-2 top-' + props.popupcontainer} style={{ border: 'solid 1px #a9a9a9' }}>
        <BsX className="popup_close" data-prop="popupcontainer" onClick={(i) => props.toggleDisplay(i)} />
        {breadLine()}
      </div>
      <div className={'border-1 border-top-0 rounded-bottom ' + props.popupcontainer} style={{ border: 'solid 1px #a9a9a9' }}>
        <div className="popupbody">
          {getInfo()}
          {getGeoRels()}
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
