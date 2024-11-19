/////////////////////////////////////////////////////////////////////////////////////////////////////
// IMPORTS //////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

import React from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { BsFilterLeft } from "react-icons/bs";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import ReactTooltip from "react-tooltip";
import locations from "../../Assets/indexes/location-index.json";
import translate from "../../Assets/indexes/translate.json";
import nationality from "../../Assets/indexes/nationality.json";
import family_trans from "../../Assets/indexes/religious_family.json";
import cat_trans from "../../Assets/indexes/categories.json";

/////////////////////////////////////////////////////////////////////////////////////////////////////
// COMPONENT ////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

function FilterMap(props) {
  // SETUP DATA  //////////////////////////////////////////////////////////////////////////////////////

  //NODE OPTIONS CALLBACK
  const loadPAffIndex = (
    inputValuePAff: string,
    callback: (options: props.pAffIndex) => void
  ) => {
    setTimeout(() => {
      callback(props.fetchPAffIndex(inputValuePAff));
    }, 1000);
  };
  const loadAffIndex = (
    inputValueAff: string,
    callback: (options: props.affIndex) => void
  ) => {
    setTimeout(() => {
      callback(props.fetchAffIndex(inputValueAff));
    }, 1000);
  };

  const nationalities = {
    all: { en: "All", zh: "都", tw: "都" },
    n_a: { en: "N/A", zh: "不适用", tw: "不適用" },
    china: { en: "China", zh: "中国", tw: "中國" },
    norway: { en: "Norway", zh: "挪威", tw: "挪威" },
    international: { en: "International", zh: "国际的", tw: "國際的" },
    united_states_of_america: {
      en: "United States of America",
      zh: "美国",
      tw: "美國",
    },
    japan: { en: "Japan", zh: "日本", tw: "日本" },
    australia: { en: "Australia", zh: "澳大利亚", tw: "澳大利亞" },
    britain: { en: "Britain", zh: "英国", tw: "英國" },
    germany: { en: "Germany", zh: "德国", tw: "德國" },
    canada: { en: "Canada", zh: "加拿大", tw: "加拿大" },
    sweden: { en: "Sweden", zh: "瑞典", tw: "瑞典" },
    denmark: { en: "Denmark", zh: "丹麦", tw: "丹麥" },
    finland: { en: "Finland", zh: "芬兰", tw: "芬蘭" },
    korea: { en: "Korea", zh: "韩国", tw: "韓國" },
    the_netherlands: { en: "The Netherlands", zh: "荷兰人", tw: "荷蘭人" },
    ireland: { en: "Ireland", zh: "爱尔兰", tw: "愛爾蘭" },
    new_zealand: { en: "New Zealand", zh: "新西兰", tw: "新西蘭" },
    france: { en: "France", zh: "法国", tw: "法國" },
    switzerland: { en: "Switzerland", zh: "瑞士", tw: "瑞士" },
    belgium: { en: "Belgium", zh: "比利时", tw: "比利時" },
    italy: { en: "Italy", zh: "意大利", tw: "意大利" },
    spain: { en: "Spain", zh: "西班牙", tw: "西班牙" },
    poland: { en: "Poland", zh: "波兰", tw: "波蘭" },
    mexico: { en: "Mexico", zh: "墨西哥", tw: "墨西哥" },
    luxembourg: { en: "Luxembourg", zh: "卢森堡", tw: "盧森堡" },
    hungary: { en: "Hungary", zh: "匈牙利", tw: "匈牙利" },
    yugoslavia: { en: "Yugoslavia", zh: "南斯拉夫", tw: "南斯拉夫" },
    macao: { en: "Macao", zh: "澳门", tw: "澳門" },
    flanders: { en: "Flanders", zh: "法兰德斯", tw: "法蘭德斯" },
    portugal: { en: "Portugal", zh: "葡萄牙", tw: "葡萄牙" },
    austria: { en: "Austria", zh: "奥地利", tw: "奧地利" },
    brazil: { en: "Brazil", zh: "巴西", tw: "巴西" },
    russia: { en: "Russia", zh: "俄罗斯", tw: "俄羅斯" },
    austrian: { en: "Austrian ", zh: "奥地利人", tw: "奧地利人" },
    belarus: { en: "Belarus", zh: "白俄罗斯", tw: "白俄羅斯" },
    ukraine: { en: "Ukraine", zh: "乌克兰", tw: "烏克蘭" },
    netherlands: { en: "Netherlands", zh: "荷兰", tw: "荷蘭" },
    unknown: { en: "Unknown", zh: "未知", tw: "未知" },
    croatia: { en: "Croatia", zh: "克罗地亚", tw: "克羅地亞" },
    czech_republic: {
      en: "Czech Republic",
      zh: "捷克共和国",
      tw: "捷克共和國",
    },
    lithuania: { en: "Lithuania", zh: "立陶宛", tw: "立陶宛" },
    holland: { en: "Holland", zh: "荷兰", tw: "荷蘭" },
    england: { en: "England", zh: "英国", tw: "英國" },
    latvia: { en: "Latvia", zh: "拉脱维亚", tw: "拉脫維亞" },
    vietnam: { en: "Vietnam", zh: "越南", tw: "越南" },
    duchy_of_savoy: {
      en: "Duchy of Savoy",
      zh: "萨沃伊公国",
      tw: "薩沃伊公國",
    },
    india: { en: "India", zh: "印度", tw: "印度" },
    haiti: { en: "Haiti", zh: "海地", tw: "海地" },
    turkey: { en: "Turkey", zh: "火鸡", tw: "火雞" },
    scotland: { en: "Scotland", zh: "苏格兰", tw: "蘇格蘭" },
    colombia: { en: "Colombia", zh: "哥伦比亚", tw: "哥倫比亞" },
    uruguay: { en: "Uruguay", zh: "乌拉圭", tw: "烏拉圭" },
    monaco: { en: "Monaco", zh: "摩纳哥", tw: "摩納哥" },
    united_kingdom: { en: "United Kingdom", zh: "英国", tw: "英國" },
    guatemala: { en: "Guatemala", zh: "危地马拉", tw: "危地馬拉" },
    egypt: { en: "Egypt", zh: "埃及", tw: "埃及" },
    philippines: { en: "Philippines", zh: "菲律宾", tw: "菲律賓" },
    libya: { en: "Libya", zh: "利比亚", tw: "利比亞" },
    slavonia: { en: "Slavonia", zh: "斯拉沃尼亚", tw: "斯拉沃尼亞" },
    wales: { en: "Wales", zh: "威尔士", tw: "威爾士" },
    canda: { en: "Canda", zh: "坎达", tw: "坎達" },
    guyana: { en: "Guyana", zh: "圭亚那", tw: "圭亞那" },
    myanmar: { en: "Myanmar", zh: "缅甸", tw: "緬甸" },
    singapore: { en: "Singapore", zh: "新加坡", tw: "新加坡" },
    malta: { en: "Malta", zh: "马耳他", tw: "馬耳他" },
    slovenia: { en: "Slovenia", zh: "斯洛文尼亚", tw: "斯洛文尼亞" },
    endland: { en: "Endland", zh: "恩德兰", tw: "恩德蘭" },
    romania: { en: "Romania", zh: "罗马尼亚", tw: "羅馬尼亞" },
    chile: { en: "Chile", zh: "智利", tw: "智利" },
    austira: { en: "Austira", zh: "奥斯蒂拉", tw: "奧斯蒂拉" },
    peru: { en: "Peru", zh: "秘鲁", tw: "秘魯" },
    argentina: { en: "Argentina", zh: "阿根廷", tw: "阿根廷" },
    slovakia: { en: "Slovakia", zh: "斯洛伐克", tw: "斯洛伐克" },
  };

  // FILTER THE NATIONALITY OPTIONS BASED ON INPUT
  const loadNatIndex = (inputValueNat, callback) => {
    // Normalize the input for case-insensitive matching
    // Ensures the input string matches nationality keys regardless of case
    const normalizedInput = inputValueNat.toLowerCase();
    const filteredOptions = [];

    for (const key in nationalities) {
      if (key.toLowerCase().includes(normalizedInput)) {
        filteredOptions.push({
          value: nationalities[key].en,
          label: nationalities[key].en,
          type: "nationality",
        });
      }
    }

    console.log(`Input Value: ${inputValueNat}`);
    console.log(`Filtered Options:`, filteredOptions);

    // const filteredOptions = Object.entries(nationalities[0])
    //   .filter(
    //     ([key, value]) =>
    //       value[props.language] && value[props.language].includes(inputValueNat)
    //   )
    //   .map(([key, value]) => {
    //     return {
    //       key: key,
    //       value: value["en"],
    //       label: value[props.language],
    //       type: "nationality",
    //     };
    //   });

    // Return filtered options
    setTimeout(() => {
      callback(filteredOptions);
    }, 1000);
  };

  //PROPERTY SORTER
  function sortByProperty(property) {
    return function (a, b) {
      if (a[property] > b[property]) return 1;
      else if (a[property] < b[property]) return -1;
      return 0;
    };
  }

  // SORT LOCATION LIST USING PROERTY SORTER
  let locationAll = [
    { name_zh: "都", name_wes: "All", value: "都", type: "location" },
  ];
  let locationList = locationAll.concat(
    locations.sort(sortByProperty("name_wes"))
  );

  // PREPARE INST CATEGORIES AND SUBCATEGORIES
  let data = props.instCatsIndex;
  let subcat = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i][0] === props.institution_category) {
      let data2 = data[i][1];
      for (let t = 0; t < data2.length; t++) {
        let i = data2[t];
        subcat.push(
          <option value={i}>
            {
              cat_trans[0][
                i.replace(/\s+$/, "").replace(/\s|\//g, "_").toLowerCase()
              ][props.language]
            }
          </option>
        );
      }
    } else {
    }
  }
  // PREPARE EVENT CATEGORIES AND SUBCATEGORIES
  let dataEvents = props.eventsCatsIndex;
  let subcatEvents = [];
  for (let i = 0; i < dataEvents.length; i++) {
    if (dataEvents[i][0] === props.event_category) {
      let dataEvents2 = dataEvents[i][1];
      for (let t = 0; t < dataEvents2.length; t++) {
        let i = dataEvents2[t];
        subcatEvents.push(
          <option value={i}>
            {
              cat_trans[0][
                i.replace(/\s+$/, "").replace(/\s|\//g, "_").toLowerCase()
              ][props.language]
            }
          </option>
        );
      }
    } else {
    }
  }

  // PEOPLE FORM CONSTRUCTOR  ////////////////////////////////////////////////////////////////////////
  // PEOPLE FORM CONSTRUCTOR  ////////////////////////////////////////////////////////////////////////
  // PEOPLE FORM CONSTRUCTOR  ////////////////////////////////////////////////////////////////////////

  if (props.kind === "People") {
    return (
      <div className="filter_area">
        <div className={props.filterDisplay}>
          <div className="filter_header">
            {translate[0]["map-filters"][props.language]}
          </div>
          <div className="filter_scroll_area mb-4">
            <Form>
              {/* FORM SELEECT ////////////////////////////////////////////////////////////////// */}
              <Form.Group className="mb-1">
                <Row>
                  <Col>
                    <Form.Label
                      className="filter_label mb-0"
                      data-tip
                      data-for="type"
                    >
                      {translate[0]["type"][props.language]}
                    </Form.Label>
                    <ReactTooltip id="type" place="right" effect="solid">
                      {translate[0]["select_type_map"][props.language]}
                    </ReactTooltip>
                    <Form.Select
                      name="kind"
                      aria-label={translate[0]["type"][props.language]}
                      value={props.kind}
                      onChange={(value) => props.handleFormChange(value)}
                    >
                      <option value="People">
                        {translate[0]["people"][props.language]}
                      </option>
                      <option value="Institutions">
                        {translate[0]["institutions"][props.language]}
                      </option>
                      <option value="Events">
                        {translate[0]["events"][props.language]}
                      </option>
                    </Form.Select>
                  </Col>
                </Row>
              </Form.Group>

              {/* TIME SELECT ////////////////////////////////////////////////////////////////// */}
              <Row className="mb-1">
                <Col>
                  <Form.Group>
                    <Row>
                      <Col>
                        <Form.Label
                          className="filter_label mb-0"
                          data-tip
                          data-for="start_year"
                        >
                          {translate[0]["start_year"][props.language]}
                        </Form.Label>
                        <ReactTooltip
                          id="start_year"
                          place="right"
                          effect="solid"
                        >
                          {translate[0]["enter_year"][props.language]}
                        </ReactTooltip>
                        <Form.Control
                          type="text"
                          name="start_year"
                          aria-label={
                            translate[0]["start_year"][props.language]
                          }
                          value={props.start_year}
                          onChange={(value) => props.handleChange(value)}
                        />
                      </Col>
                    </Row>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Row>
                      <Col>
                        <Form.Label
                          className="filter_label mb-0"
                          data-tip
                          data-for="end_year"
                        >
                          {translate[0]["end_year"][props.language]}
                        </Form.Label>
                        <ReactTooltip
                          id="end_year"
                          place="right"
                          effect="solid"
                        >
                          {translate[0]["enter_year"][props.language]}
                        </ReactTooltip>
                        <Form.Control
                          type="text"
                          name="end_year"
                          aria-label={translate[0]["end_year"][props.language]}
                          value={props.end_year}
                          onChange={(value) => props.handleChange(value)}
                        />
                      </Col>
                    </Row>
                  </Form.Group>
                </Col>
              </Row>

              {/* PERS AFF SELECT ////////////////////////////////////////////////////////////////// */}
              <Form.Group className="mb-1">
                <Row>
                  <Col>
                    <Form.Label
                      className="filter_label mb-0"
                      data-tip
                      data-for="affiliation"
                    >
                      {translate[0]["affiliation"][props.language]}
                    </Form.Label>
                    <ReactTooltip id="affiliation" place="right" effect="solid">
                      {translate[0]["type_to_select"][props.language]}
                    </ReactTooltip>
                    <AsyncSelect
                      loadOptions={loadPAffIndex}
                      placeholder={translate[0]["type_to"][props.language]}
                      onInputChange={props.handleMapInputChange}
                      getOptionLabel={(option) => option[props.language]}
                      defaultInputValue={props.inputValuePAff}
                      onChange={(option) => props.handleChangeData(option)}
                      components={{
                        DropdownIndicator: () => null,
                        IndicatorSeparator: () => null,
                      }}
                    />
                  </Col>
                </Row>
              </Form.Group>

              {/* NATIONALITY SELECT ////////////////////////////////////////////////////////////////// */}
              <Form.Group className="mb-1">
                <Row>
                  <Col>
                    <Form.Label
                      className="filter_label mb-0"
                      data-tip
                      data-for="nationality"
                    >
                      {translate[0]["nationality"][props.language]}
                    </Form.Label>
                    <ReactTooltip id="nationality" place="right" effect="solid">
                      {translate[0]["type_to_select_country"][props.language]}
                    </ReactTooltip>
                    <AsyncSelect
                      loadOptions={loadNatIndex}
                      placeholder={translate[0]["type_to"][props.language]}
                      onInputChange={props.handleMapNatInputChange}
                      getOptionLabel={(option) =>
                        nationality[0][option.value]["en"]
                      }
                      defaultInputValue={props.inputValueNat}
                      onChange={(option) => props.handleChangeData(option)}
                      components={{
                        DropdownIndicator: () => null,
                        IndicatorSeparator: () => null,
                      }}
                    />
                  </Col>
                </Row>
              </Form.Group>

              {/* PLACE SELECT ////////////////////////////////////////////////////////////////// */}
              <Form.Group className="mb-1">
                <Row>
                  <Col>
                    <Form.Label
                      className="filter_label mb-0"
                      data-tip
                      data-for="location"
                    >
                      {translate[0]["location"][props.language]}
                    </Form.Label>
                    <ReactTooltip id="location" place="right" effect="solid">
                      {translate[0]["type_to_select_location"][props.language]}
                    </ReactTooltip>
                    <Select
                      name="location"
                      aria-label={translate[0]["location"][props.language]}
                      placeholder={translate[0]["all"][props.language]}
                      options={locationList}
                      getOptionLabel={(option) => {
                        if (
                          props.language === "zh" ||
                          props.language === "tw"
                        ) {
                          return option.name_zh;
                        } else {
                          return `${option.name_wes} (${option.name_zh})`; // fix to display Chinese name next to English
                        }
                      }}
                      onChange={(e) => props.handleChangeData(e)}
                      components={{ IndicatorSeparator: () => null }}
                    />
                  </Col>
                </Row>
              </Form.Group>

              {/* GENDER SELECT ////////////////////////////////////////////////////////////////// */}
              <Form.Group className="mb-1">
                <Row>
                  <Col>
                    <Form.Label
                      className="filter_label mb-0"
                      data-tip
                      data-for="gender"
                    >
                      {translate[0]["gender"][props.language]}
                    </Form.Label>
                    <ReactTooltip id="gender" place="right" effect="solid">
                      {translate[0]["select_start"][props.language]}{" "}
                      {translate[0]["gender"][props.language]}
                    </ReactTooltip>
                    <Form.Select
                      name="gender"
                      aria-label={translate[0]["gender"][props.language]}
                      value={props.gender}
                      onChange={(value) => props.handleChange(value)}
                    >
                      <option value="All">
                        {translate[0]["all"][props.language]}
                      </option>
                      <option value="Female">
                        {translate[0]["female"][props.language]}
                      </option>
                      <option value="Male">
                        {translate[0]["male"][props.language]}
                      </option>
                    </Form.Select>
                  </Col>
                </Row>
              </Form.Group>
            </Form>
          </div>

          {/* BUTTONS SELECT ////////////////////////////////////////////////////////////////// */}
          <div className="filter-buttons">
            <Row className="mb-1">
              <Col>
                <Button
                  className="mb-1 col-12"
                  variant="danger"
                  onClick={() => props.fetchResults()}
                >
                  {translate[0]["submit"][props.language]}
                </Button>
              </Col>
              <Col>
                <Button
                  className="mb-1 col-12"
                  variant="outline-danger"
                  onClick={() => props.resetFilter()}
                >
                  {translate[0]["clear-all"][props.language]}
                </Button>
              </Col>
            </Row>
          </div>

          {/* FILTER TOGGLE SELECT ////////////////////////////////////////////////////////////////// */}
          <div className="filter_button_container">
            <div
              onClick={() => props.filterHide()}
              className="filter_button"
              data-tip
              data-for="toggle"
            >
              <ReactTooltip id="toggle" place="right" effect="solid">
                {translate[0]["toggle_filters"][props.language]}
              </ReactTooltip>
              <BsFilterLeft />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // INSTITUTION FORM CONSTRUCTOR ////////////////////////////////////////////////////////////////////////////////
  // INSTITUTION FORM CONSTRUCTOR ////////////////////////////////////////////////////////////////////////////////
  // INSTITUTION FORM CONSTRUCTOR ////////////////////////////////////////////////////////////////////////////////
  else if (props.kind === "Institutions") {
    let defaultInput;
    if (props.inputValueAff !== "") {
      defaultInput = props.inputValueAff;
    } else {
      defaultInput = translate[0]["type_to"][props.language];
    }

    return (
      <div className="filter_area">
        <div className={props.filterDisplay}>
          <div className="filter_header">
            {translate[0]["map-filters"][props.language]}
          </div>
          <div className="filter_scroll_area mb-4">
            <Form>
              {/* FORM SELEECT ////////////////////////////////////////////////////////////////// */}
              <Form.Group className="mb-1">
                <Row>
                  <Col>
                    <Form.Label
                      className="filter_label mb-0"
                      data-tip
                      data-for="type"
                    >
                      {translate[0]["type"][props.language]}
                    </Form.Label>
                    <ReactTooltip id="type" place="right" effect="solid">
                      {translate[0]["select_type_map"][props.language]}
                    </ReactTooltip>
                    <Form.Select
                      name="kind"
                      aria-label={translate[0]["type"][props.language]}
                      value={props.kind}
                      onChange={(value) => props.handleFormChange(value)}
                    >
                      <option value="People">
                        {translate[0]["people"][props.language]}
                      </option>
                      <option value="Institutions">
                        {translate[0]["institutions"][props.language]}
                      </option>
                      <option value="Events">
                        {translate[0]["events"][props.language]}
                      </option>
                    </Form.Select>
                  </Col>
                </Row>
              </Form.Group>

              {/* TIME SELECT ////////////////////////////////////////////////////////////////// */}
              <Row className="mb-1">
                <Col>
                  <Form.Group>
                    <Row>
                      <Col>
                        <Form.Label
                          className="filter_label mb-0"
                          data-tip
                          data-for="start_year"
                        >
                          {translate[0]["start_year"][props.language]}
                        </Form.Label>
                        <ReactTooltip
                          id="start_year"
                          place="right"
                          effect="solid"
                        >
                          {translate[0]["enter_year"][props.language]}
                        </ReactTooltip>
                        <Form.Control
                          type="text"
                          name="start_year"
                          aria-label={
                            translate[0]["start_year"][props.language]
                          }
                          value={props.start_year}
                          onChange={(value) => props.handleChange(value)}
                        />
                      </Col>
                    </Row>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Row>
                      <Col>
                        <Form.Label
                          className="filter_label mb-0"
                          data-tip
                          data-for="end_year"
                        >
                          {translate[0]["end_year"][props.language]}
                        </Form.Label>
                        <ReactTooltip
                          id="end_year"
                          place="right"
                          effect="solid"
                        >
                          {translate[0]["enter_year"][props.language]}
                        </ReactTooltip>
                        <Form.Control
                          type="text"
                          name="end_year"
                          aria-label={translate[0]["end_year"][props.language]}
                          value={props.end_year}
                          onChange={(value) => props.handleChange(value)}
                        />
                      </Col>
                    </Row>
                  </Form.Group>
                </Col>
              </Row>

              {/* NAME SELECT ////////////////////////////////////////////////////////////////// */}
              <Form.Group className="mb-1">
                <Row>
                  <Col>
                    <Form.Label
                      className="filter_label mb-0"
                      data-tip
                      data-for="inst_name"
                    >
                      {translate[0]["inst_name"][props.language]}
                    </Form.Label>
                    <ReactTooltip id="inst_name" place="right" effect="solid">
                      {translate[0]["enter_name"][props.language]}
                    </ReactTooltip>
                    <Form.Control
                      type="text"
                      name="name_western"
                      aria-label={translate[0]["inst_name"][props.language]}
                      value={props.name_western}
                      onChange={(value) => props.handleChange(value)}
                    />
                  </Col>
                </Row>
              </Form.Group>

              {/* INST AFF SELECT ////////////////////////////////////////////////////////////////// */}
              <Form.Group className="mb-1">
                <Row>
                  <Col>
                    <Form.Label
                      className="filter_label mb-0"
                      data-tip
                      data-for="inst_affiliation"
                    >
                      {translate[0]["inst_affiliation"][props.language]}
                    </Form.Label>
                    <ReactTooltip
                      id="inst_affiliation"
                      place="right"
                      effect="solid"
                    >
                      {translate[0]["type_to_select"][props.language]}
                    </ReactTooltip>
                    <AsyncSelect
                      loadOptions={loadAffIndex}
                      onInputChange={props.handleMapAffInputChange}
                      placeholder={defaultInput}
                      defaultInputValue={props.inputValueAff}
                      getOptionLabel={(option) => option[props.language]}
                      onChange={(option) => props.handleChangeData(option)}
                      components={{
                        DropdownIndicator: () => null,
                        IndicatorSeparator: () => null,
                      }}
                    />
                  </Col>
                </Row>
              </Form.Group>

              {/* RELIGIOUS FAMILY SELECT ////////////////////////////////////////////////////////////////// */}
              <Form.Group className="mb-1">
                <Row>
                  <Col>
                    <Form.Label
                      className="filter_label mb-0"
                      data-tip
                      data-for="religious_family"
                    >
                      {translate[0]["religious_family"][props.language]}
                    </Form.Label>
                    <ReactTooltip
                      id="religious_family"
                      place="right"
                      effect="solid"
                    >
                      {
                        translate[0]["type_to_select_religious_family"][
                          props.language
                        ]
                      }
                    </ReactTooltip>
                    <Select
                      name="religious_family"
                      aria-label={
                        translate[0]["religious_family"][props.language]
                      }
                      placeholder={translate[0]["select"][props.language]}
                      options={props.relFamIndex}
                      getOptionLabel={(option) =>
                        family_trans[0][
                          option.value
                            .replace(/\s+$/, "")
                            .replace(/\s|\//g, "_")
                            .toLowerCase()
                        ][props.language]
                      }
                      onChange={(e) => props.handleChangeData(e)}
                      components={{ IndicatorSeparator: () => null }}
                    />
                  </Col>
                </Row>
              </Form.Group>

              {/* PLACE SELECT ////////////////////////////////////////////////////////////////// */}
              <Form.Group className="mb-1">
                <Row>
                  <Col>
                    <Form.Label
                      className="filter_label mb-0"
                      data-tip
                      data-for="location"
                    >
                      {translate[0]["location"][props.language]}
                    </Form.Label>
                    <ReactTooltip id="location" place="right" effect="solid">
                      {translate[0]["type_to_select_location"][props.language]}
                    </ReactTooltip>
                    <Select
                      name="location"
                      aria-label={translate[0]["location"][props.language]}
                      placeholder={translate[0]["all"][props.language]}
                      options={locationList}
                      getOptionLabel={(option) => {
                        if (
                          props.language === "zh" ||
                          props.language === "tw"
                        ) {
                          return option.name_zh;
                        } else {
                          return `${option.name_wes} (${option.name_zh})`;
                        }
                      }}
                      onChange={(e) => props.handleChangeData(e)}
                      components={{ IndicatorSeparator: () => null }}
                    />
                  </Col>
                </Row>
              </Form.Group>

              {/* CATEGORY SELECT ////////////////////////////////////////////////////////////////// */}
              <Form.Group className="mb-1">
                <Row>
                  <Col>
                    <Form.Label
                      className="filter_label mb-0"
                      data-tip
                      data-for="inst_category"
                    >
                      {translate[0]["inst_category"][props.language]}
                    </Form.Label>
                    <ReactTooltip
                      id="inst_category"
                      place="right"
                      effect="solid"
                    >
                      {translate[0]["select_start"][props.language]}{" "}
                      {translate[0]["category"][props.language]}
                    </ReactTooltip>
                    <Form.Select
                      name="institution_category"
                      aria-label={translate[0]["inst_category"][props.language]}
                      value={props.institution_category}
                      onChange={(i) => props.handleChange(i)}
                    >
                      {props.instCatsIndex.map((node, i) => {
                        let val = node[0];
                        return (
                          <option data-index={i} value={val}>
                            {
                              cat_trans[0][
                                val
                                  .replace(/\s+$/, "")
                                  .replace(/\s|\//g, "_")
                                  .toLowerCase()
                              ][props.language]
                            }
                          </option>
                        );
                      })}
                    </Form.Select>
                  </Col>
                </Row>
              </Form.Group>

              {/* SUBCATEGORY SELECT ////////////////////////////////////////////////////////////////// */}
              <Form.Group className="mb-1">
                <Row>
                  <Col>
                    <Form.Label
                      className="filter_label mb-0"
                      data-tip
                      data-for="inst_subcategory"
                    >
                      {translate[0]["inst_subcategory"][props.language]}
                    </Form.Label>
                    <ReactTooltip
                      id="inst_subcategory"
                      place="right"
                      effect="solid"
                    >
                      {translate[0]["select_start"][props.language]}{" "}
                      {translate[0]["subcategory"][props.language]}
                    </ReactTooltip>
                    <Form.Select
                      name="institution_subcategory"
                      aria-label={
                        translate[0]["inst_subcategory"][props.language]
                      }
                      value={props.institution_subcategory}
                      onChange={(value) => props.handleChange(value)}
                    >
                      {subcat}
                    </Form.Select>
                  </Col>
                </Row>
              </Form.Group>
            </Form>
          </div>

          {/* BUTTONS SELECT ////////////////////////////////////////////////////////////////// */}
          <div className="filter-buttons">
            <Row className="mb-1">
              <Col>
                <Button
                  className="mb-1 col-12"
                  variant="danger"
                  onClick={() => props.fetchResults()}
                >
                  {translate[0]["submit"][props.language]}
                </Button>
              </Col>
              <Col>
                <Button
                  className="mb-1 col-12"
                  variant="outline-danger"
                  onClick={() => props.resetFilter()}
                >
                  {translate[0]["clear-all"][props.language]}
                </Button>
              </Col>
            </Row>
          </div>

          {/* FILTER TOGGLE SELECT ////////////////////////////////////////////////////////////////// */}
          <div className="filter_button_container">
            <div
              onClick={() => props.filterHide()}
              className="filter_button"
              data-tip
              data-for="toggle"
            >
              <ReactTooltip id="toggle" place="right" effect="solid">
                {translate[0]["toggle_filters"][props.language]}
              </ReactTooltip>
              <BsFilterLeft />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // EVENT FORM CONSTRUCTOR ////////////////////////////////////////////////////////////////////////////////
  // EVENT FORM CONSTRUCTOR ////////////////////////////////////////////////////////////////////////////////
  // EVENT FORM CONSTRUCTOR ////////////////////////////////////////////////////////////////////////////////
  else if (props.kind === "Events") {
    return (
      <div className="filter_area">
        <div className={props.filterDisplay}>
          <div className="filter_header">
            {translate[0]["map-filters"][props.language]}
          </div>
          <div className="filter_scroll_area mb-4">
            <Form>
              {/* FORM SELEECT ////////////////////////////////////////////////////////////////// */}
              <Form.Group className="mb-1">
                <Row>
                  <Col>
                    <Form.Label
                      className="filter_label mb-0"
                      data-tip
                      data-for="type"
                    >
                      {translate[0]["type"][props.language]}
                    </Form.Label>
                    <ReactTooltip id="type" place="right" effect="solid">
                      {translate[0]["select_type_map"][props.language]}
                    </ReactTooltip>
                    <Form.Select
                      name="kind"
                      aria-label={translate[0]["type"][props.language]}
                      value={props.kind}
                      onChange={(value) => props.handleFormChange(value)}
                    >
                      <option value="People">
                        {translate[0]["people"][props.language]}
                      </option>
                      <option value="Institutions">
                        {translate[0]["institutions"][props.language]}
                      </option>
                      <option value="Events">
                        {translate[0]["events"][props.language]}
                      </option>
                    </Form.Select>
                  </Col>
                </Row>
              </Form.Group>

              {/* TIME SELECT ////////////////////////////////////////////////////////////////// */}
              <Row className="mb-1">
                <Col>
                  <Form.Group>
                    <Row>
                      <Col>
                        <Form.Label
                          className="filter_label mb-0"
                          data-tip
                          data-for="start_year"
                        >
                          {translate[0]["start_year"][props.language]}
                        </Form.Label>
                        <ReactTooltip
                          id="start_year"
                          place="right"
                          effect="solid"
                        >
                          {translate[0]["enter_year"][props.language]}
                        </ReactTooltip>
                        <Form.Control
                          type="text"
                          name="start_year"
                          aria-label={
                            translate[0]["start_year"][props.language]
                          }
                          value={props.start_year}
                          onChange={(value) => props.handleChange(value)}
                        />
                      </Col>
                    </Row>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Row>
                      <Col>
                        <Form.Label
                          className="filter_label mb-0"
                          data-tip
                          data-for="end_year"
                        >
                          {translate[0]["end_year"][props.language]}
                        </Form.Label>
                        <ReactTooltip
                          id="end_year"
                          place="right"
                          effect="solid"
                        >
                          {translate[0]["enter_year"][props.language]}
                        </ReactTooltip>
                        <Form.Control
                          type="text"
                          name="end_year"
                          aria-label={translate[0]["end_year"][props.language]}
                          value={props.end_year}
                          onChange={(value) => props.handleChange(value)}
                        />
                      </Col>
                    </Row>
                  </Form.Group>
                </Col>
              </Row>

              {/* NAME SELECT ////////////////////////////////////////////////////////////////// */}
              <Form.Group className="mb-1">
                <Row>
                  <Col>
                    <Form.Label
                      className="filter_label mb-0"
                      data-tip
                      data-for="inst_name"
                    >
                      {translate[0]["event_name"][props.language]}
                    </Form.Label>
                    <ReactTooltip id="event_name" place="right" effect="solid">
                      {translate[0]["enter_name"][props.language]}
                    </ReactTooltip>
                    <Form.Control
                      type="text"
                      name="name_western"
                      aria-label={translate[0]["event_name"][props.language]}
                      value={props.name_western}
                      onChange={(value) => props.handleChange(value)}
                    />
                  </Col>
                </Row>
              </Form.Group>

              {/* PLACE SELECT ////////////////////////////////////////////////////////////////// */}
              <Form.Group className="mb-1">
                <Row>
                  <Col>
                    <Form.Label
                      className="filter_label mb-0"
                      data-tip
                      data-for="location"
                    >
                      {translate[0]["location"][props.language]}
                    </Form.Label>
                    <ReactTooltip id="location" place="right" effect="solid">
                      {translate[0]["type_to_select_location"][props.language]}
                    </ReactTooltip>
                    <Select
                      name="location"
                      aria-label={translate[0]["location"][props.language]}
                      placeholder={translate[0]["all"][props.language]}
                      options={locationList}
                      getOptionLabel={(option) => {
                        if (
                          props.language === "zh" ||
                          props.language === "tw"
                        ) {
                          return option.name_zh;
                        } else {
                          return `${option.name_wes} (${option.name_zh})`;
                        }
                      }}
                      onChange={(e) => props.handleChangeData(e)}
                      components={{ IndicatorSeparator: () => null }}
                    />
                  </Col>
                </Row>
              </Form.Group>

              {/* CATEGORY SELECT ////////////////////////////////////////////////////////////////// */}
              <Form.Group className="mb-1">
                <Row>
                  <Col>
                    <Form.Label
                      className="filter_label mb-0"
                      data-tip
                      data-for="event_category"
                    >
                      {translate[0]["event_category"][props.language]}
                    </Form.Label>
                    <ReactTooltip
                      id="event_category"
                      place="right"
                      effect="solid"
                    >
                      {translate[0]["select_start"][props.language]}{" "}
                      {translate[0]["category"][props.language]}
                    </ReactTooltip>
                    <Form.Select
                      name="event_category"
                      aria-label={
                        translate[0]["event_category"][props.language]
                      }
                      value={props.event_category}
                      onChange={(i) => props.handleChange(i)}
                    >
                      {props.eventsCatsIndex.map((node, i) => {
                        let val = node[0];
                        return (
                          <option data-index={i} value={val}>
                            {
                              cat_trans[0][
                                val
                                  .replace(/\s+$/, "")
                                  .replace(/\s|\//g, "_")
                                  .toLowerCase()
                              ][props.language]
                            }
                          </option>
                        );
                      })}
                    </Form.Select>
                  </Col>
                </Row>
              </Form.Group>

              {/* SUBCATEGORY SELECT ////////////////////////////////////////////////////////////////// */}
              <Form.Group className="mb-1">
                <Row>
                  <Col>
                    <Form.Label
                      className="filter_label mb-0"
                      data-tip
                      data-for="event_subcategory"
                    >
                      {translate[0]["event_subcategory"][props.language]}
                    </Form.Label>
                    <ReactTooltip
                      id="event_subcategory"
                      place="right"
                      effect="solid"
                    >
                      {translate[0]["select_start"][props.language]}{" "}
                      {translate[0]["subcategory"][props.language]}
                    </ReactTooltip>
                    <Form.Select
                      name="event_subcategory"
                      aria-label={
                        translate[0]["event_subcategory"][props.language]
                      }
                      value={props.event_subcategory}
                      onChange={(value) => props.handleChange(value)}
                    >
                      {subcatEvents}
                    </Form.Select>
                  </Col>
                </Row>
              </Form.Group>
            </Form>
          </div>

          {/* BUTTONS SELECT ////////////////////////////////////////////////////////////////// */}
          <Row className="mb-1">
            <Col>
              <Button
                className="mb-1 col-12"
                variant="danger"
                onClick={() => props.fetchResults()}
              >
                {translate[0]["submit"][props.language]}
              </Button>
            </Col>
            <Col>
              <Button
                className="mb-1 col-12"
                variant="outline-danger"
                onClick={() => props.resetFilter()}
              >
                {translate[0]["clear-all"][props.language]}
              </Button>
            </Col>
          </Row>

          {/* FILTER TOGGLE SELECT ////////////////////////////////////////////////////////////////// */}
          <div className="filter_button_container">
            <div
              onClick={() => props.filterHide()}
              className="filter_button"
              data-tip
              data-for="toggle"
            >
              <ReactTooltip id="toggle" place="right" effect="solid">
                {translate[0]["toggle_filters"][props.language]}
              </ReactTooltip>
              <BsFilterLeft />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
// EXPORT //////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

export default FilterMap;
