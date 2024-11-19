/////////////////////////////////////////////////////////////////////////////////////////////////////
// IMPORTS //////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

import { Link } from "react-router-dom";
import { FaMapMarkedAlt } from "react-icons/fa";
import { BiNetworkChart, BiLineChart } from "react-icons/bi";
import ReactTooltip from "react-tooltip";
import translate from "../../Assets/indexes/translate.json";

/////////////////////////////////////////////////////////////////////////////////////////////////////
// TOGGLES & HIDES  /////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

//HIDE NETWORK LEGEND
export function hideKey() {
  if (this.state.networkKey === "addinfo hide") {
    this.setState({ networkKey: "addinfo" });
    this.setState({ keyBorder: "border-bottom-0 rounded-top" });
  } else {
    this.setState({ networkKey: "addinfo hide" });
    this.setState({ keyBorder: "rounded" });
  }
}

//TOGGLE DISPLAYS
export function toggleCite(event) {
  if (this.state.cite === "cite hide") {
    this.setState({ cite: "cite" });
  } else if (this.state.cite === "cite") {
    this.setState({ cite: "cite hide" });
  } else {
    this.setState({ cite: "cite" });
  }
}

//TOGGLE DISPLAYS
export function toggleDisplay(event) {
  let v = event.target.dataset.prop;
  let h = event.target.dataset.prop + " hide";
  let p = "popupcontainer";
  let v2 = event.target.dataset.prop + "-full";
  let h2 = event.target.dataset.prop + "-full hide";
  let h3 = event.target.dataset.prop + "-full2";
  let f = "popupcontainer-full";
  let t;

  if (this.state.nodeSelect !== "") {
    this.setState({ nodeSelect: "" });
  } else {
  }

  if (event.target.dataset.prop === "addinfo") {
    t = "addinfortext";
  } else if (event.target.dataset.prop === "addpers") {
    t = "addperstext";
  } else if (event.target.dataset.prop === "addinst") {
    t = "addinsttext";
  } else if (event.target.dataset.prop === "addevent") {
    t = "addeventtext";
  } else if (event.target.dataset.prop === "addcorp") {
    t = "addcorptext";
  } else if (event.target.dataset.prop === "addpub") {
    t = "addpubtext";
  }

  if ((this.state[v] === v && v === p) || (this.state[v] === v2 && v2 === f)) {
    let hidden = this.state[v] + " hide";
    this.setState({ [v]: hidden });
    this.setState({ [t]: "additional_info" });
    this.setState({ breadCrumb: [] });
  } else if (this.state[v] === v) {
    let hidden = v + " hide";
    this.setState({ [v]: hidden });
    this.setState({ [t]: "additional_info" });
    return this.state[v];
  } else if (this.state[v] === h) {
    this.setState({ [v]: v });
    this.setState({ [t]: "hide_additional_info" });
    return this.state[v];
  } else if (this.state[v] === h2) {
    this.setState({ [v]: v2 });
    this.setState({ [t]: "hide_additional_info" });
    return this.state[v];
  } else if (this.state[v] === h3) {
    this.setState({ [v]: h });
    this.setState({ [t]: "additional_info" });
    this.setState({ breadCrumb: [] });
    return this.state[v];
  }
}

//TOGGLE FILTER STATE
export function filterHide() {
  const test = "filter_container";
  const testdata = "filter_data_container";
  const testdata2 = "filter_data_container hide";
  if (this.state.filterDisplay === test) {
    this.setState({ filterDisplay: "filter_container2" });
    if (this.state.popupcontainer === "popupcontainer") {
      this.setState({ popupcontainer: "popupcontainer-full" });
    } else if (this.state.popupcontainer === "popupcontainer hide") {
      this.setState({ popupcontainer: "popupcontainer-full hide" });
    }
    return this.state.filterDisplay;
  } else if (this.state.filterDisplay === testdata) {
    this.setState({ filterDisplay: "filter_data_container hide" });
    return this.state.filterDisplay;
  } else if (this.state.filterDisplay === testdata2) {
    this.setState({ filterDisplay: "filter_data_container" });
    return this.state.filterDisplay;
  } else if (this.state.filterDisplay !== test) {
    this.setState({ filterDisplay: "filter_container" });
    if (this.state.popupcontainer === "popupcontainer-full") {
      this.setState({ popupcontainer: "popupcontainer" });
    } else if (this.state.popupcontainer === "popupcontainer-full hide") {
      this.setState({ popupcontainer: "popupcontainer hide" });
    }
    return this.state.filterDisplay;
  }
}

//LANGUAGE SWITCHER
export function langSwitch(event) {
  let l = event.target.attributes.value.value;
  this.setState({ language: l });
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
// FILTER HANDLERS  /////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

export function reFilterSet() {
  this.setState({ refilter: "no" });
}

// HANDLE CHECKS IN SEARCH FILTER
export function filterResults() {
  this.setState({ refilter: "yes" });
  // GENERAL FILTERS
  let label;
  if (this.state.label.length > 0) {
    label = this.state.label;
  } else {
    label = this.state.labelList;
  }
  let religious_family;
  if (this.state.religious_family.length > 0) {
    religious_family = this.state.religious_family;
  } else {
    religious_family = this.state.relFamList;
  }
  let christian_tradition;
  if (this.state.christian_tradition.length > 0) {
    christian_tradition = this.state.christian_tradition;
  } else {
    christian_tradition = this.state.christTradList;
  }
  // PEOPLE FILTERS
  let gender;
  if (this.state.gender.length > 0) {
    gender = this.state.gender;
  } else {
    gender = this.state.genderList;
  }
  let nationality;
  if (this.state.nationality.length > 0) {
    nationality = this.state.nationality;
  } else {
    nationality = this.state.nationalityList;
  }
  let name_western;
  if (this.state.name_western.length > 0) {
    name_western = this.state.name_western;
  } else {
    name_western = this.state.affList;
  }
  // INST FILTERS
  let institution_category;
  if (this.state.institution_category.length > 0) {
    institution_category = this.state.institution_category;
  } else {
    institution_category = this.state.instCatList;
  }
  let institution_subcategory;
  if (this.state.institution_subcategory.length > 0) {
    institution_subcategory = this.state.institution_subcategory;
  } else {
    institution_subcategory = this.state.instSubCatList;
  }
  let inst_name_western;
  if (this.state.inst_name_western.length > 0) {
    inst_name_western = this.state.inst_name_western;
  } else {
    inst_name_western = this.state.instList;
  }
  // CORP FILTERS
  let corporate_entity_category;
  if (this.state.corporate_entity_category.length > 0) {
    corporate_entity_category = this.state.corporate_entity_category;
  } else {
    corporate_entity_category = this.state.corpCatList;
  }
  let corporate_entity_subcategory;
  if (this.state.corporate_entity_subcategory.length > 0) {
    corporate_entity_subcategory = this.state.corporate_entity_subcategory;
  } else {
    corporate_entity_subcategory = this.state.corpSubCatList;
  }
  // EVENT FILTERS
  let event_category;
  if (this.state.event_category.length > 0) {
    event_category = this.state.event_category;
  } else {
    event_category = this.state.eventCatList;
  }
  let event_subcategory;
  if (this.state.event_subcategory.length > 0) {
    event_subcategory = this.state.event_subcategory;
  } else {
    event_subcategory = this.state.eventSubCatList;
  }
  // publication FILTERS
  let publication_category;
  if (this.state.publication_category.length > 0) {
    publication_category = this.state.publication_category;
  } else {
    publication_category = this.state.pubCatList;
  }
  let publication_subcategory;
  if (this.state.publication_subcategory.length > 0) {
    publication_subcategory = this.state.publication_subcategory;
  } else {
    publication_subcategory = this.state.pubSubCatList;
  }

  //CONSTRUCT FILTEREED RESULTS
  if (
    label !== this.state.labelList ||
    religious_family !== this.state.relFamList ||
    christian_tradition !== this.state.christTradList ||
    this.state.start_year !== "" ||
    this.state.end_year !== ""
  ) {
    let personFilter;
    let instFilter;
    let corpFilter;
    let eventFilter;
    let pubFilter;
    if (label.includes("Person")) {
      personFilter = this.state.nodeArray.filter(
        (e) =>
          label.includes(e.label) &&
          religious_family.includes(e.other.religious_family) &&
          christian_tradition.includes(e.other.christian_tradition) &&
          gender.includes(e.properties.gender) &&
          nationality.includes(e.properties.nationality) &&
          name_western.includes(
            e.other.name_western || e.other.alternative_name_western
          )
      );
    }
    if (label.includes("Institution")) {
      instFilter = this.state.nodeArray.filter(
        (e) =>
          label.includes(e.label) &&
          religious_family.includes(e.other.religious_family) &&
          christian_tradition.includes(e.properties.christian_tradition) &&
          institution_category.includes(
            e.other.institution_category || e.properties.institution_category
          ) &&
          institution_subcategory.includes(
            e.other.institution_subcategory ||
              e.properties.institution_subcategory
          )
      );
    }
    if (label.includes("CorporateEntity")) {
      corpFilter = this.state.nodeArray.filter(
        (e) =>
          label.includes(e.label) &&
          religious_family.includes(e.properties.religious_family) &&
          christian_tradition.includes(e.properties.christian_tradition) &&
          corporate_entity_category.includes(
            e.properties.corporate_entity_category ||
              e.other.corporate_entity_category
          ) &&
          corporate_entity_subcategory.includes(
            e.properties.corporate_entity_subcategory ||
              e.other.corporate_entity_subcategory
          )
      );
    }
    if (label.includes("Event")) {
      eventFilter = this.state.nodeArray.filter(
        (e) =>
          label.includes(e.label) &&
          religious_family.includes(e.properties.religious_family) &&
          christian_tradition.includes(e.properties.christian_tradition) &&
          event_category.includes(
            e.properties.event_category || e.other.event_category
          ) &&
          event_subcategory.includes(
            e.properties.event_subcategory || e.other.event_subcategory
          )
      );
    }
    if (label.includes("Publication")) {
      pubFilter = this.state.nodeArray.filter(
        (e) =>
          label.includes(e.label) &&
          religious_family.includes(e.properties.religious_family) &&
          christian_tradition.includes(e.properties.christian_tradition) &&
          publication_category.includes(
            e.properties.publication_category || e.other.publication_category
          ) &&
          publication_subcategory.includes(
            e.properties.publication_subcategory ||
              e.other.publication_subcategory
          )
      );
    }
    const filterArraySub = []
      .concat(personFilter, instFilter, corpFilter, eventFilter, pubFilter)
      .filter((i) => i !== undefined);

    let filterArray = [];
    for (let i = 0; i < filterArraySub.length; i++) {
      if (
        filterArraySub[i].start_year >= this.state.start_year &&
        filterArraySub[i].end_year <= this.state.end_year &&
        filterArraySub[i].end_year != null &&
        filterArraySub[i].start_year != null
      ) {
        filterArray.push(filterArraySub[i]);
      } else if (
        filterArraySub[i].start_year >= this.state.start_year &&
        this.state.end_year == "" &&
        filterArraySub[i].end_year != null &&
        filterArraySub[i].start_year != null
      ) {
        filterArray.push(filterArraySub[i]);
      } else if (
        this.state.start_year == "" &&
        filterArraySub[i].end_year <= this.state.end_year &&
        filterArraySub[i].end_year != null &&
        filterArraySub[i].start_year != null
      ) {
        filterArray.push(filterArraySub[i]);
      } else if (this.state.start_year == "" && this.state.end_year == "") {
        filterArray.push(filterArraySub[i]);
      }
    }

    this.setState({ filterArray });
    if (filterArray.length === 0) {
      this.setState({ noresults: "noresults" });
    }
  } else {
    let filterArray = this.state.nodeArray;
    this.setState({ filterArray });
  }
}

// HANDLE FORM CHANGE IN FILTER
export function handleFormChange(event) {
  this.resetFilter();
  this.setState({ [event.target.name]: event.target.value });
  if (this.state.kind === "People") {
    this.setState({
      personEntry: "mb-2 details",
      instEntry: "mb-2 details hide",
      orgEntry: "mb-2 details hide",
    });
  } else if (this.state.kind === "Institutions") {
    this.setState({
      personEntry: "mb-2 details hide",
      instEntry: "mb-2 details",
      orgEntry: "mb-2 details hide",
    });
  } else if (this.state.kind === "Organizations") {
    this.setState({
      personEntry: "mb-2 details hide",
      instEntry: "mb-2 details hide",
      orgEntry: "mb-2 details",
    });
  } else {
  }
}

// HANDLE CHANGES IN FILTER
export function handleChange(event) {
  this.setState({
    [event.target.name]: event.target.value,
  });
}

// HANDLE CHANGES IN FILTER
export function handleChangeData(event) {
  console.log(event);
  this.setState({ [event.type]: event.value });
  this.setState({ sentInputValue: event.label });
  console.log(event.type);
  console.log(event.value);
}

// HANDLE CHANGES IN DD FILTER
export function handleChangeDataDD(event) {
  let node_id = event.value;
  let newInput = event.option;
  let selectedOption;
  if (event.type === "Institution") {
    selectedOption = "Institution";
  }
  if (event.type === "CorporateEntity") {
    selectedOption = "CorporateEntity";
  }
  if (event.type === "Event") {
    selectedOption = "Event";
  }
  if (event.type === "Geography") {
    selectedOption = "Geography";
  }
  if (event.type === "Village") {
    selectedOption = "Geography";
  }
  if (event.type === "Township") {
    selectedOption = "Geography";
  }
  if (event.type === "County") {
    selectedOption = "Geography";
  }
  if (event.type === "Prefecture") {
    selectedOption = "Geography";
  }
  if (event.type === "Province") {
    selectedOption = "Geography";
  } else {
  }
  this.setState({ node_id });
  this.setState({ selectedOption });
  this.setState({ inputValue: newInput });
}

// HANDLE CHANGES IN RADIO BUUTTON FILTER
export function handleOptionChange(event) {
  this.setState({ selectedOption: event.target.value }, () => {
    console.log(" ");
  });
}

export function handleInputChange(newValue: string) {
  const inputValue = newValue;
  this.setState({ inputValue });
}

export function handleMapInputChange(newValue: string) {
  const inputValue = newValue;
  this.setState({ inputValuePAff: inputValue });
}

export function handleMapAffInputChange(newValue: string) {
  const inputValue = newValue;
  this.setState({ inputValueAff: inputValue });
}

export function handleMapNatInputChange(newValue: string) {
  const inputValue = newValue;

  this.setState({ inputValueNat: inputValue });
  console.log(inputValue);
  console.log(newValue);
}

// HANDLE CHECKS IN NETWORK FILTER
export function handleCheck(event) {
  const target = event.target;
  const value = target.type === "checkbox" ? target.checked : target.value;
  const name = target.name;
  this.setState({ [name]: value });
}

// HANDLE CHECKS IN SEARCH FILTER
export function handleFilterCheck(event) {
  if (this.state[event.target.name].length === 0) {
    this.setState({ [event.target.name]: [event.target.value] });
  } else if (this.state[event.target.name].indexOf(event.target.value) > -1) {
    let arr = this.state[event.target.name].filter(
      (e) => e !== event.target.value
    );
    this.setState({ [event.target.name]: arr });
  } else {
    let arr = this.state[event.target.name];
    let newArr = arr.concat(event.target.value);
    this.setState({ [event.target.name]: newArr });
  }
}

// CLEAR ALL FILTERS
export function clearFilters() {
  let filterArray = this.state.nodeArray;
  this.setState({ filterArray });
  this.setState({ label: "" });
  this.setState({ nationality: "" });
  this.setState({ gender: "" });
  this.setState({ religious_family: "" });
  this.setState({ christian_tradition: "" });
  this.setState({ institution_category: "" });
  this.setState({ institution_subcategory: "" });
  this.setState({ corporate_entity_category: "" });
  this.setState({ corporate_entity_subcategory: "" });
  this.setState({ event_category: "" });
  this.setState({ event_subcategory: "" });
  this.setState({ name_western: "" });
  this.setState({ inst_name_western: "" });
  this.setState({ province: "" });
  this.setState({ prefecture: "" });
  this.setState({ county: "" });
}

//RESET FILTER AND RELOAD PAGE
export function resetFilter() {
  this.setState({ sent_id: "init" });
  this.setState({ given_name_western: "" });
  this.setState({ family_name_western: "" });
  this.setState({ name_western: "" });
  this.setState({ religious_family: "All" });
  this.setState({ institution_category: "All" });
  this.setState({ institution_subcategory: "All" });
  this.setState({ event_category: "All" });
  this.setState({ event_subcategory: "All" });
  this.setState({ gender: "All" });
  this.setState({ nationality: "All" });
  this.setState({ location: "All" });
  this.setState({ affiliation: "All" });
  this.setState({ start_year: "" });
  this.setState({ end_year: "" });
  this.setState({ relFamIndex: [] });
  this.setState({ affIndex: [] });
  this.setState({ pAffIndex: [] });
  this.setState({ natIndex: [] });
  this.setState({ placeIndex: [] });
  this.setState({ inputValuePAff: "" });
  this.setState({ inputValueAff: "" });
  this.setState({ inputValueNat: "" });
  this.setState({ nodeArray: [] });
  this.setState({ degree: 1 });
  this.setState({ people_include: false });
  this.setState({ inst_include: false });
  this.setState({ corp_include: false });
  this.setState({ event_include: false });
  this.setState({ pub_include: false });
  this.setState({ inputValue: "" });
  this.setState({ selectedOption: "All" });
  this.setState({ node_id: "" });
  this.setState({ nodeArray: [] });

  const del = this.props.searchParams.delete(
    "sent_id",
    "node_id",
    "selectedOption",
    "degree",
    "node_id",
    "selectedOption",
    "sentInputValue",
    "given_name_western",
    "family_name_western",
    "name_western",
    "religious_family",
    "institution_category",
    "institution_subcategory",
    "event_category",
    "event_subcategory",
    "gender",
    "nationality",
    "location",
    "affiliation",
    "start_year",
    "end_year",
    "people_include",
    "corp_include",
    "inst_include",
    "event_include",
    "pub_include"
  );
  this.props.setSearchParams(del);
}

export function handleKeyPress(e) {
  let text = e.value;
  if (e.key === "Enter") {
    handleKeyPress(text);
  } else {
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
// BREACRUMBS //////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

//BREADCRUMB CONSTRUCTOR
export function breadCrumbChainer() {
  let crumb = {
    key: this.state.selectArray[0].key,
    family_name_western:
      this.state.selectArray[0].select_node.family_name_western,
    given_name_western:
      this.state.selectArray[0].select_node.given_name_western,
    chinese_family_name_hanzi:
      this.state.selectArray[0].select_node.chinese_family_name_hanzi,
    chinese_given_name_hanzi:
      this.state.selectArray[0].select_node.chinese_given_name_hanzi,
    name_western: this.state.selectArray[0].select_node.name_western,
    chinese_name_hanzi:
      this.state.selectArray[0].select_node.chinese_name_hanzi,
    name_wes: this.state.selectArray[0].select_node.name_wes,
    name_zh: this.state.selectArray[0].select_node.name_zh,
    order: this.state.breadCrumb.length + 1,
  };
  let breadCrumbArray = this.state.breadCrumb;
  let newBreadCrumbArray = breadCrumbArray.concat(crumb);
  this.setState({ breadCrumb: newBreadCrumbArray });
}

//BREADCRUMB LINK HANDLER
export function breadCrumbReducer(event, order) {
  let index = this.state.breadCrumb.findIndex((element) => {
    if (element.order === order) {
      return true;
    }
  });
  let i = index + 1;
  let newlist = this.state.breadCrumb.slice(0, i);
  this.setState({ breadCrumb: newlist });
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
// LINK ADDITION/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

// ADD MAP AND NETWORK LINKS BASED ON NODE TYPE & PROPERTIES
export function linkCheck(props, node) {
  let tester;
  if (node.label) {
    tester = node.properties;
  } else if (node.select_kind) {
    tester = node.select_node;
  }
  if (node.label === "Person" || node.select_kind === "Person") {
    return (
      <div className="d-inline-block">
        <Link
          title="geographic map"
          to="/map"
          state={{
            langgive: props.language,
            kind: "People",
            given_name_western: tester.given_name_western,
            family_name_western: tester.family_name_western,
            sent_id: node.key,
          }}
        >
          <FaMapMarkedAlt className="link-icons" data-tip data-for="map" />
          <ReactTooltip id="map" place="bottom" effect="solid">
            {translate[0]["view_map"][props.language]}
          </ReactTooltip>
        </Link>
        <Link
          title="network map"
          to="/network"
          state={{
            langgive: props.language,
            sent_id: node.key,
            selected_option: "Person",
            input_value:
              tester.given_name_western + " " + tester.family_name_western,
          }}
        >
          <BiNetworkChart className="link-icons" data-tip data-for="network" />
          <ReactTooltip id="network" place="bottom" effect="solid">
            {translate[0]["view_network"][props.language]}
          </ReactTooltip>
        </Link>
      </div>
    );
  } else if (
    (node.label === "Institution" &&
      node.properties.institution_category !== "General Area") ||
    (node.select_kind === "Institution" &&
      node.select_node.institution_category !== "General Area")
  ) {
    return (
      <div className="d-inline-block">
        <Link
          title="geographic map"
          to="/map"
          state={{
            langgive: props.language,
            kind: "Institutions",
            name_western: tester.name_western,
            sent_id: node.key,
          }}
        >
          <FaMapMarkedAlt className="link-icons" data-tip data-for="map" />
          <ReactTooltip id="map" place="bottom" effect="solid">
            {translate[0]["view_map"][props.language]}
          </ReactTooltip>
        </Link>
        <Link
          title="network map"
          to="/network"
          state={{
            langgive: props.language,
            sent_id: node.key,
            selected_option: "Institution",
            input_value: tester.name_western,
          }}
        >
          <BiNetworkChart className="link-icons" data-tip data-for="network" />
          <ReactTooltip id="network" place="bottom" effect="solid">
            {translate[0]["view_network"][props.language]}
          </ReactTooltip>
        </Link>
        <Link
          title="data vis"
          to="/data"
          state={{
            langgive: props.language,
            kind: "Institution",
            sent_id: node.key,
          }}
        >
          <BiLineChart className="link-icons" data-tip data-for="data" />
          <ReactTooltip id="network" place="bottom" effect="solid">
            {translate[0]["data"][props.language]}
          </ReactTooltip>
        </Link>
      </div>
    );
  } else if (
    tester.corporate_entity_category === "Religious Body" &&
    (node.label === "CorporateEntity" || node.select_kind === "CorporateEntity")
  ) {
    return (
      <div className="d-inline-block">
        <Link
          title="geographic map"
          to="/map"
          state={{
            langgive: props.language,
            kind: "Institutions",
            corp_name_western: tester.name_western,
            sent_id: node.key,
          }}
        >
          <FaMapMarkedAlt className="link-icons" data-tip data-for="map" />
          <ReactTooltip id="map" place="bottom" effect="solid">
            {translate[0]["view_map"][props.language]}
          </ReactTooltip>
        </Link>
        <Link
          title="network map"
          to="/network"
          state={{
            langgive: props.language,
            sent_id: node.key,
            selected_option: "CorporateEntity",
            input_value: tester.name_western,
          }}
        >
          <BiNetworkChart className="link-icons" data-tip data-for="network" />
          <ReactTooltip id="network" place="bottom" effect="solid">
            {translate[0]["view_network"][props.language]}
          </ReactTooltip>
        </Link>
        <Link
          title="data vis"
          to="/data"
          state={{
            langgive: props.language,
            kind: "CorporateEntity",
            sent_id: node.key,
          }}
        >
          <BiLineChart className="link-icons" data-tip data-for="data" />
          <ReactTooltip id="network" place="bottom" effect="solid">
            {translate[0]["data"][props.language]}
          </ReactTooltip>
        </Link>
      </div>
    );
  } else if (node.label === "Event" || node.select_kind === "Event") {
    return (
      <div className="d-inline-block">
        <Link
          title="geographic map"
          to="/map"
          state={{
            langgive: props.language,
            kind: "Events",
            name_western: tester.name_western,
            sent_id: node.key,
          }}
        >
          <FaMapMarkedAlt className="link-icons" data-tip data-for="map" />
          <ReactTooltip id="map" place="bottom" effect="solid">
            {translate[0]["view_map"][props.language]}
          </ReactTooltip>
        </Link>
        <Link
          title="network map"
          to="/network"
          state={{
            langgive: props.language,
            sent_id: node.key,
            selected_option: "Event",
            input_value: tester.name_western,
          }}
        >
          <BiNetworkChart className="link-icons" data-tip data-for="network" />
          <ReactTooltip id="network" place="bottom" effect="solid">
            {translate[0]["view_network"][props.language]}
          </ReactTooltip>
        </Link>
      </div>
    );
  } else if (
    node.label === "Publication" ||
    node.select_kind === "Publication"
  ) {
    return (
      <div className="d-inline-block">
        <Link
          title="network map"
          to="/network"
          state={{
            langgive: props.language,
            sent_id: node.key,
            selected_option: "Publication",
            input_value: tester.name_western,
          }}
        >
          <BiNetworkChart className="link-icons" data-tip data-for="network" />
          <ReactTooltip id="network" place="bottom" effect="solid">
            {translate[0]["view_network"][props.language]}
          </ReactTooltip>
        </Link>
      </div>
    );
  } else {
    return null;
  }
}

// Renames property (key) name of object
export function renameProperty(obj, oldName, newName) {
  obj[newName] = obj[oldName];
  delete obj[oldName];
}

export function getCitation(title, link) {
  let alex;
  if (this.state.language === "en") {
    alex = "Alex Mayfield";
  } else {
    alex = "马飞立";
  }

  let daryl;
  if (this.state.language === "en") {
    daryl = "Daryl Ireland";
  } else {
    daryl = "艾德恩";
  }

  let eugenio;
  if (this.state.language === "en") {
    eugenio = ", and Eugenio Menegon";
  } else {
    eugenio = "和梅欧金";
  }

  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth();
  let year = date.getFullYear();

  const monthlist = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let access_date;
  if (this.state.language === "en") {
    access_date = monthlist[month] + " " + day + ", " + year;
  } else {
    access_date = year + " 年 " + month + "月" + day + " 日";
  }

  let publish_date;
  if (this.state.language === "en") {
    publish_date = "January 19, 2024";
  } else {
    publish_date = "2024 年 1 月 19 日";
  }

  return (
    <div>
      {alex}, {daryl}
      {eugenio}. "{title}."{" "}
      <i>{translate[0].chcd_name[this.state.language]}.</i> V2.1. {publish_date}
      . {translate[0].accessed[this.state.language]} {access_date}. {link}.
    </div>
  );
}
