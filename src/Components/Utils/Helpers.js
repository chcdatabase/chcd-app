//TOGGLE DISPLAYS
export function toggleDisplay(event) {
  let v = event.target.dataset.prop;
  let h = event.target.dataset.prop + " hide";
  let p ="popupcontainer";
  if (this.state[v] === v && v === p) {
    let hidden = v + " hide";
    this.setState ({ [v]: hidden });
    this.setState ({ addinfo: "addinfo hide" });
    this.setState ({ breadCrumb: [] });
  }
  else if (this.state[v] === v) {
    let hidden = v + " hide";
    this.setState ({ [v]: hidden });
    return this.state[v];
  }
  else if (this.state[v] === h)  {
    this.setState ({ [v]: v });
    return this.state[v];
  }
};

//TOGGLE FILTER STATE
export function filterHide() {
  const test = "filter_container"
  if (this.state.filterDisplay === test) {
    this.setState ({filterDisplay: "filter_container2"})
    return this.state.filterDisplay
  } else if (this.state.filterDisplay !== test) {
    this.setState ({filterDisplay: "filter_container"})
    return this.state.filterDisplay
  }
};

// HANDLE FORM CHANGE IN FILTER
export function handleFormChange(event) {
    this.setState({[event.target.name]: event.target.value});
    if (this.state.kind === "People") {
      this.setState ({
        personEntry: "mb-2 details",
        instEntry: "mb-2 details hide",
        orgEntry: "mb-2 details hide"})
    } else if (this.state.kind === "Institutions") {
      this.setState ({
        personEntry: "mb-2 details hide",
        instEntry: "mb-2 details",
        orgEntry: "mb-2 details hide"})
    } else if (this.state.kind === "Organizations") {
      this.setState ({
        personEntry: "mb-2 details hide",
        instEntry: "mb-2 details hide",
        orgEntry: "mb-2 details"})
    } else {}
};

//RESET FILTER AND RELOAD PAGE
export function resetFilter() {
  this.setState ({given_name_western: ""});
  this.setState ({family_name_western: ""});
  this.setState ({gender: "All"});
  this.setState ({nationality: ""});
  this.setState ({location: ""});
  this.setState ({affiliation: ""});
  this.setState ({start_time: ""});
  this.setState ({end_time: ""});
  this.setState ({mapBounds: [[54.31,137.28],[18.312,71.63],]});
  this.setState ({nodeArray: []});
};

// HANDLE CHANGES IN FILTER
export function handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value}
    );
};

// HANDLE CHANGES IN FILTER
export function handleChangeData(event) {
  const data = event.value;
    this.setState({node_id: data});
};

// HANDLE CHECKS IN NETWORK FILTER
export function handleCheck(event) {
   const target = event.target;
   const value = target.type === 'checkbox' ? target.checked : target.value;
   const name = target.name;
   this.setState({[name]: value});
 };

// HANDLE CHECKS IN SEARCH FILTER
export function handleFilterCheck(event) {
  if (this.state[event.target.name].length === 0) {
    this.setState({ [event.target.name]: [event.target.value] });
  }
  else if (this.state[event.target.name].indexOf(event.target.value) > -1) {
    let arr = this.state[event.target.name].filter(e => e !== event.target.value)
    this.setState({ [event.target.name]: arr });
  }
  else {
    let arr = this.state[event.target.name]
    let newArr = arr.concat(event.target.value)
    this.setState({ [event.target.name]: newArr });
  }
};

//BREADCRUMB CONSTRUCTOR
 export function breadCrumbChainer() {
   let crumb = {
     key: this.state.selectArray[0].key,
     family_name_western: this.state.selectArray[0].select_node.family_name_western,
     given_name_western: this.state.selectArray[0].select_node.given_name_western,
     name_western: this.state.selectArray[0].select_node.name_western,
     order: this.state.breadCrumb.length + 1
   };
   let breadCrumbArray = this.state.breadCrumb;
   let newBreadCrumbArray = breadCrumbArray.concat(crumb);
   this.setState({ breadCrumb: newBreadCrumbArray })
 };

//BREADCRUMB LINK HANDLER
 export function breadCrumbReducer(event, order) {
   let index = this.state.breadCrumb.findIndex(element => {if (element.order === order ) {return true}});
   let i = index + 1;
   let newlist = this.state.breadCrumb.slice(0, i)
   this.setState({ breadCrumb: newlist })
 };

 export function handleKeyPress(e) {
   let text = e.value;
   if (e.key === "Enter") {
     handleKeyPress(text);
   } else {}
}

// HANDLE CHECKS IN SEARCH FILTER
export function filterResults() {
  // GENERAL FILTERS
  let label; if (this.state.label.length > 0) {label = this.state.label} else { label = this.state.labelList };
  let religious_family; if (this.state.religious_family.length > 0) {religious_family = this.state.religious_family} else { religious_family = this.state.relFamList };
  let christian_tradition; if (this.state.christian_tradition.length > 0) {christian_tradition = this.state.christian_tradition} else { christian_tradition = this.state.christTradList };
  // PEOPLE FILTERS
  let gender; if (this.state.gender.length > 0) {gender = this.state.gender} else { gender = this.state.genderList };
  let nationality; if (this.state.nationality.length > 0) {nationality = this.state.nationality} else { nationality = this.state.nationalityList };
  let name_western; if (this.state.name_western.length > 0) {name_western = this.state.name_western} else {name_western = this.state.affList};
  // INST FILTERS
  let institution_category; if (this.state.institution_category.length > 0) {institution_category = this.state.institution_category} else { institution_category = this.state.instCatList };
  let institution_subcategory; if (this.state.institution_subcategory.length > 0) {institution_subcategory = this.state.institution_subcategory} else { institution_subcategory = this.state.instSubCatList };
  let inst_name_western; if (this.state.inst_name_western.length > 0) {inst_name_western = this.state.inst_name_western} else {inst_name_western = this.state.instList};
  // CORP FILTERS
  let corporate_entity_category; if (this.state.corporate_entity_category.length > 0) {corporate_entity_category = this.state.corporate_entity_category} else { corporate_entity_category = this.state.corpCatList };
  let corporate_entity_subcategory; if (this.state.corporate_entity_subcategory.length > 0) {corporate_entity_subcategory = this.state.corporate_entity_subcategory} else { corporate_entity_subcategory = this.state.corpSubCatList };
  // EVENT FILTERS
  let event_category; if (this.state.event_category.length > 0) {event_category = this.state.event_category} else { event_category = this.state.eventCatList };
  let event_subcategory; if (this.state.event_subcategory.length > 0) {event_subcategory = this.state.event_subcategory} else { event_subcategory = this.state.eventSubCatList };

  //CONSTRUCT FILTEREED RESULTS
  if (label !== this.state.labelList || religious_family !== this.state.relFamList || christian_tradition !== this.state.christTradList || this.state.start_year !== "" || this.state.end_year !== "") {
    let personFilter; let instFilter; let corpFilter; let eventFilter;
    if (label.includes("Person")) { personFilter = this.state.nodeArray.filter(e =>
        label.includes(e.label) &&
        religious_family.includes(e.other.religious_family) &&
        christian_tradition.includes(e.other.christian_tradition) &&
        gender.includes(e.properties.gender) &&
        nationality.includes(e.properties.nationality) &&
        name_western.includes(e.other.name_western || e.other.alternative_name_western)
    )}
    if (label.includes("Institution")) { instFilter = this.state.nodeArray.filter(e =>
        label.includes(e.label) &&
        inst_name_western.includes(e.other.name_western || e.other.alternative_name_western) &&
        religious_family.includes(e.other.religious_family) &&
        christian_tradition.includes(e.properties.christian_tradition) &&
        institution_category.includes(e.other.institution_category || e.properties.institution_category) &&
        institution_subcategory.includes(e.other.institution_subcategory || e.properties.institution_subcategory)
    )}
    if (label.includes("CorporateEntity")) { corpFilter = this.state.nodeArray.filter(e =>
        label.includes(e.label) &&
        religious_family.includes(e.properties.religious_family) &&
        christian_tradition.includes(e.properties.christian_tradition) &&
        corporate_entity_category.includes(e.properties.corporate_entity_category || e.other.corporate_entity_category) &&
        corporate_entity_subcategory.includes(e.properties.corporate_entity_subcategory || e.other.corporate_entity_subcategory)
    )}
    if (label.includes("Event")) { eventFilter = this.state.nodeArray.filter(e =>
        label.includes(e.label) &&
        religious_family.includes(e.properties.religious_family) &&
        christian_tradition.includes(e.properties.christian_tradition) &&
        event_category.includes(e.properties.event_category || e.other.event_category) &&
        event_subcategory.includes(e.properties.event_subcategory || e.other.event_subcategory)
    )}
    const filterArraySub = [].concat(personFilter, instFilter, corpFilter, eventFilter).filter(i => i !== undefined)

    let filterArray = [];
    for (let i = 0; i < filterArraySub.length; i++ ) {
      if (filterArraySub[i].start_year >= this.state.start_year && filterArraySub[i].end_year <= this.state.end_year && filterArraySub[i].end_year != null && filterArraySub[i].start_year != null ) {
        filterArray.push(filterArraySub[i])
      }
      else if (filterArraySub[i].start_year >= this.state.start_year && this.state.end_year == "" && filterArraySub[i].end_year != null && filterArraySub[i].start_year != null ) {
        filterArray.push(filterArraySub[i])
      }
      else if (this.state.start_year  == "" && filterArraySub[i].end_year <= this.state.end_year && filterArraySub[i].end_year != null && filterArraySub[i].start_year != null ) {
        filterArray.push(filterArraySub[i])
      }
      else if (this.state.start_year == "" && this.state.end_year == "") {
        filterArray.push(filterArraySub[i])
      }
    }

    this.setState({ filterArray });
    if (filterArray.length === 0) {this.setState ({ noresults: "noresults" });}

    console.log(filterArray)

  } else {
    let filterArray = this.state.nodeArray;
    this.setState({ filterArray })
  }
};

export function clearFilters() {
  let filterArray = this.state.nodeArray;
  this.setState({ filterArray })
};
