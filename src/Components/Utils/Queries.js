import locations from "../../Assets/indexes/location-index.json"

/////////////////////////////////////////////////////////////////////////////////////////////////////
// MAIN SEARCH & FILTER QUERIES /////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

export function fetchSearch() {
  if (this.state.search !== "") {
  this.setState ({ content: "loading" })
  const session = this.driver.session();
  const searchProp = this.state.search;

  const query = `
    CALL db.index.fulltext.queryNodes("allPropIndex", "`+ searchProp +`~") YIELD node
    WITH node MATCH (node)-[t]-(m)
    RETURN {key:id(node), properties:properties(node), label:labels(node)[0], rel:t.rel_type, other:properties(m), start_year:t.start_year, end_year:t.end_year} as Nodes
    UNION
    MATCH (node)-[t]-(m) WHERE (any(prop in keys(m) WHERE m[prop] =~ '(?i).*`+ searchProp +`.*'))
    RETURN {key:id(node), properties:properties(node), label:labels(node)[0], rel:t.rel_type, other_label:labels(m)[0], other:properties(m), start_year:t.start_year, end_year:t.end_year} as Nodes
    `
  session
  .run(query)
  .then((results) => {
    this.setState ({ nodeArray: [], filterArray: [], genderList: [], nationalityList: [], labelList: [], relFamList: [], christTradList: [], instCatList: [], instSubCatList: [], corpCatList: [], corpSubCatList: [], eventCatList: [], eventSubCatList: [], affList: [] });
    this.setState ({ label: "", nationality: "", gender: "", religious_family: "", christian_tradition: "", institution_category: "", institution_subcategory: "", corporate_entity_category: "", corporate_entity_subcategory: "", event_category: "", event_subcategory: "", name_western: "", inst_name_western: "" });

    const nodeArray = results.records.map((record) => record.get('Nodes'));
    if (nodeArray.length === 0) {this.setState ({ noresults: "noresults" }); this.setState ({ content: "loaded" });}

    else {
      let filterArray = nodeArray;
      let labelList = [...new Set(nodeArray.map(item => item.label))];
      let genderList = [...new Set(nodeArray.map(item => item.properties.gender))];
      let nationalityList = [...new Set(nodeArray.map(item => item.properties.nationality))];
      let relFamList = [...new Set(nodeArray.map(item => item.other.religious_family))];
      let christTradList = [...new Set(nodeArray.map(item => item.other.christian_tradition))];
      let instCatList = [...new Set(nodeArray.map(item => item.properties.institution_category))];
      let instSubCatList = [...new Set(nodeArray.map(item => item.properties.institution_subcategory))];
      let corpCatList = [...new Set(nodeArray.map(item => item.properties.corporate_entity_category))];
      let corpSubCatList = [...new Set(nodeArray.map(item => item.properties.corporate_entity_subcategory))];
      let eventCatList = [...new Set(nodeArray.map(item => item.properties.event_category))];
      let eventSubCatList = [...new Set(nodeArray.map(item => item.properties.event_subcategory))];
      let affList = [...new Set(nodeArray.map(item => {if (item.label === "Person") { return item.other.name_western }}))];
      let instList = [...new Set(nodeArray.map(item => {if (item.label === "Institution" && item.other.corporate_entity_category) { return item.other.name_western }}))];

      this.setState ({noResults: "no_results hide", content: "loaded" });
      this.setState ({ nodeArray, filterArray });
      this.setState ({ instList, affList, genderList, nationalityList, labelList, relFamList, christTradList, instCatList, instSubCatList, corpCatList, corpSubCatList, eventCatList, eventSubCatList });
    }
    session.close()})
  } else {}
}

//QUERY TO FETCH RESULTS FOR MAP AND LIST FILTER
export function fetchResults() {
  if (
    this.state.family_name_western === "" &&
    this.state.given_name_western === "" &&
    this.state.name_western === "" &&
    this.state.institution_category === "All" &&
    this.state.institution_subcategory === "All" &&
    this.state.gender === "All" &&
    this.state.nationality === "All" &&
    (this.state.location === "All" || this.state.location === "都") &&
    this.state.affiliation === "All" &&
    this.state.religious_family === "All" &&
    this.state.location === "" &&
    this.state.start_year === "" &&
    this.state.end_year === "" ) {
      this.setState ({nosend: "nosend"})
  } else {
    this.setState ({ content: "loading" })
    const session = this.driver.session();

    //CONSTRUCT FILTERS FROM USER INPUT
    let familyNameFilter; if (this.state.family_name_western !== "") {familyNameFilter = 'family_name_western: "' + this.state.family_name_western + '"'} else { familyNameFilter = ""};
    let givenNameFilter; if (this.state.given_name_western !== "") {givenNameFilter = 'given_name_western: "' + this.state.given_name_western + '"'} else { givenNameFilter = ""};
    let nameFilter; if (this.state.name_western !== "") {nameFilter = 'name_western: "' + this.state.name_western + '"'} else { nameFilter = ""};
    let icatFilter; if (this.state.institution_category === "All") { icatFilter = ""} else if (this.state.institution_category !== "All" || this.state.institution_category !== "" ) {icatFilter = 'institution_category: "' + this.state.institution_category + '"'} else { icatFilter = ""};
    let isubcatFilter; if (this.state.institution_subcategory === "All") { isubcatFilter = ""} else if (this.state.institution_subcategory !== "All" || this.state.institution_subcategory !== "" ) {isubcatFilter = 'institution_subcategory: "' + this.state.institution_subcategory + '"'} else { isubcatFilter = ""};
    let genderFilter; if (this.state.gender !== "All") {genderFilter = 'gender: "' + this.state.gender + '"'} else { genderFilter = ""};
    let nationalityFilter; if (this.state.nationality === "All") {nationalityFilter =""} else if (this.state.nationality !== "") {nationalityFilter = 'nationality: "' + this.state.nationality + '"'} else { nationalityFilter = ""};
    let affFilter;  if (this.state.affiliation === "All") {affFilter =""} else if (this.state.affiliation !== "All" || this.state.affiliation !== "") {affFilter = 'name_western: "' + this.state.affiliation + '"'} else { affFilter = ""};
    let relFamFilter; if (this.state.religious_family !== "All") {relFamFilter = 'religious_family: "' + this.state.religious_family + '"'} else { relFamFilter = ""};
    let locatFilter = []; for (let i=0; i < locations.length; i++) { if (locations[i].name_zh === this.state.location) {locatFilter.push(locations[i].contains)}}
    let timeFilter;
      if (this.state.start_year !== "" && this.state.end_year !== "") {timeFilter = 'WHERE ((t.start_year <= ' + this.state.end_year + ') AND (t.start_year >=' + this.state.start_year + ')) OR t.start_year IS NULL'}
      else if (this.state.start_year === "" && this.state.end_year !== "") {timeFilter = 'WHERE (t.start_year <= ' + this.state.end_year + ') OR t.start_year IS NULL'}
      else if (this.state.start_year !== "" && this.state.end_year === "") {timeFilter = 'WHERE (t.start_year >= ' + this.state.start_year + ') OR t.start_year IS NULL'}
      else { timeFilter = ""};

    //CONCAT & CLEAN FILTERS
    const filterStatic = [familyNameFilter, givenNameFilter, genderFilter, nationalityFilter]
    const filterStaticClean = filterStatic.filter(value => value.length > 1).join();

    const corpFilterStatic = [relFamFilter, affFilter]
    const corpFilterStaticClean = corpFilterStatic.filter(value => value.length > 1).join();
    const instFilterStatic = [nameFilter, icatFilter, isubcatFilter]
    const instFilterStaticClean = instFilterStatic.filter(value => value.length > 1).join();

    //CONSTRUCT QUERY WITH VARIABLES
    let query;
    if (this.state.kind === "People") {
        const query = `
          MATCH (n:Person {`+ filterStaticClean +`})-[t]->(r:Institution)-[]->(e:CorporateEntity {`+ affFilter +`})`+ timeFilter +`
          WITH n,r,e,t MATCH (r)-[]->(l) WHERE (l:Township OR l:Village OR l:County OR l:Prefecture OR l:Province)
          RETURN {key:id(n),properties:properties(n),inst:properties(r),aff:properties(e),locat:properties(l),rel:properties(t),locat_name:properties(l).name_wes} AS Nodes
          UNION MATCH (e:CorporateEntity {`+ affFilter +`})<-[]-(n:Person {`+ filterStaticClean +`})-[t]->(r:Institution)`+ timeFilter +`
          WITH n,r,e,t MATCH (r)-[]->(l)
          WHERE (l:Township OR l:Village OR l:County OR l:Prefecture OR l:Province)
          RETURN {key:id(n),properties:properties(n),inst:properties(r),aff:properties(e),locat:properties(l),rel:properties(t),locat_name:properties(l).name_wes} AS Nodes
          `
          session
          .run(query)
          .then((results) => {
            let unfiltArray = results.records.map((record) => record.get('Nodes'));
            let nodeArray;
              if (this.state.location !== "All" && this.state.location !== "都" ) { nodeArray = unfiltArray.filter(e => locatFilter[0].includes(e.locat.name_zh))}
              else {nodeArray = unfiltArray};
            if (nodeArray.length === 0) {
              this.setState ({ noresults: "noresults" });
              this.setState ({ content: "loaded" });
            }
            else {
              const mapBounds = nodeArray.map(node => ([node.locat.latitude,node.locat.longitude]));
              this.setState ({ nodeArray });
              this.setState ({ mapBounds });
              this.setState ({noresults: "noresults hide"})
              this.setState ({ content: "loaded" })
            }
            session.close()})

    } else if (this.state.kind === "Institutions") {
        const query = `
          MATCH (r:Institution {`+ instFilterStaticClean +`})-[t]-(e:CorporateEntity {`+ corpFilterStaticClean +`})`+ timeFilter +`
          WITH r,e,t MATCH (r)-[]->(l) WHERE (l:Township OR l:Village OR l:County OR l:Prefecture OR l:Province)
          RETURN {key:id(r),properties:properties(r),aff:properties(e),locat:properties(l),rel:properties(t),locat_name:properties(l).name_wes} AS Nodes
          `
          session.run(query).then((results) => {
            let unfiltArray = results.records.map((record) => record.get('Nodes'));
            let nodeArray;
              if (this.state.location !== "All" && this.state.location !== "都" ) { nodeArray = unfiltArray.filter(e => locatFilter[0].includes(e.locat.name_zh))}
              else {nodeArray = unfiltArray};
            if (nodeArray.length === 0) {
              this.setState ({ noresults: "noresults" });
              this.setState ({ content: "loaded" });
            }
            else {
              const mapBounds = nodeArray.map(node => ([node.locat.latitude,node.locat.longitude]));
              this.setState ({ nodeArray });
              this.setState ({ mapBounds });
              this.setState ({noresults: "noresults hide"})
              this.setState ({ content: "loaded" })
            }
            session.close()})
     }

  }
}

//QUERY FOR NETWORK DATA FILTER
export function fetchNetworkResults() {
  if (this.state.node_id === "") {
      this.setState ({nosend: "nosend"})
  }
  else {
  this.setState ({ content: "loading" })
    const session = this.driver.session();

    //CONSTRUCT FILTERS FROM USER INPUT
    let nodeIdFilter;
      if (this.state.node_id !== "") {
        nodeIdFilter = 'WHERE id(n) ='+ parseFloat(this.state.node_id) +' '
      } else { nodeIdFilter = ""};

        let degreeFilter; if (this.state.degree !== 1) {degreeFilter = this.state.degree} else { degreeFilter = 1};
        let peopleFilter; if (this.state.people_include === true) {peopleFilter = "+"} else {peopleFilter = "-"}
        let instFilter; if (this.state.inst_include === true) {instFilter = "+"} else {instFilter = "-"}
        let corpFilter; if (this.state.corp_include === true) {corpFilter = "+"} else {corpFilter = "-"}
        let eventFilter; if (this.state.event_include === true) {eventFilter = "+"} else {eventFilter = "-"}

    //CONCAT FILTERS
    const filterStatic = [nodeIdFilter]
    const filterStaticClean = filterStatic.filter(value => value.length > 1).join();

    //CONSTRUCT QUERY WITH VARIABLES
    const query = `
      MATCH (n:Person)-[t]-(o)`+ nodeIdFilter +`
      CALL apoc.path.subgraphAll(n, {
              maxLevel:`+degreeFilter+`,
              labelFilter:"`+ peopleFilter +`Person|`+ instFilter +`Institution|`+ corpFilter +`CorporateEntity|`+ eventFilter +`Event|-Village|-Township|-County|-Prefecture|-Province"
            })
            YIELD nodes, relationships
      WITH [node in nodes | node {key:id(node), label:labels(node)[0], properties:properties(node)}] as nodes,
           [rel in relationships | rel {source:id(startNode(rel)), target:id(endNode(rel)), start_year:rel.start_year, end_year:rel.end_year}] as rels
      RETURN {nodes:nodes, links:rels} as Graph
      `

      session
      .run(query)
      .then((results) => {
        const newArray = results.records.map((record) => record.get('Graph'));
        let ulinks = newArray[0].links;
        let links = [];
        for (let i = 0; i < ulinks.length; i++) {
          if ((
                (this.state.start_year !== "" && this.state.end_year !== "") &&
                (ulinks[i].start_year >= this.state.start_year && ulinks[i].end_year <= this.state.end_year || ulinks[i].end_year === null )
              ) || (
                (this.state.start_year === "" && this.state.end_year !== "") &&
                (ulinks[i].start_year <= this.state.end_year || ulinks[i].end_year <= this.state.end_year || ulinks[i].end_year === null )
              ) || (
                (this.state.start_year !== "" && this.state.end_year === "") &&
                (ulinks[i].start_year >= this.state.state_year || ulinks[i].end_year >= this.state.start_year || ulinks[i].start_year === null )
              ) || (
                (this.state.start_year === "" && this.state.end_year === "")
              )
            ) {links.push(ulinks[i])}
        }

        const nodeArray = [{nodes: newArray[0].nodes, links: links, }]

        if (nodeArray.length === 0) {this.setState ({ noresults: "noresults" })}
        else {
          this.setState ({ nodeArray });
          this.setState ({ noresults: "noresults hide" })
          this.setState ({ content: "loaded" })
        }
        session.close()});
    }
  };



/////////////////////////////////////////////////////////////////////////////////////////////////////
// QUERIES FOR POPUP INFORMATION ////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

//QUERY FOR SELECTED NODE + APPEND BREADCRUMB (CLICK IN POPUP CONTENT)
export function selectSwitchAppend(event) {
    this.setState({nodeSelect: event});
    const session = this.driver.session()
    const selectquery = `
    MATCH (n)-[t]-(p:Person) WHERE ID(n) =` + event +` RETURN {key:id(n), select_node:properties(n), key2:id(p), node2:properties(p), rel_kind:labels(p)[0], rel:properties(t)} AS SelectNodes
    UNION MATCH (n)-[t]-(p:CorporateEntity) WHERE ID(n) =` + event +` RETURN {key:id(n), select_node:properties(n), key2:id(p), node2:properties(p), rel_kind:labels(p)[0], rel:properties(t)} AS SelectNodes
    UNION MATCH (n)-[t]-(p:Institution) WHERE ID(n) =` + event +` RETURN {key:id(n), select_node:properties(n), key2:id(p), node2:properties(p), rel_kind:labels(p)[0], rel:properties(t)} AS SelectNodes
    UNION MATCH (n)-[t]-(p:Event) WHERE ID(n) =` + event +` RETURN {key:id(n), select_node:properties(n), key2:id(p), node2:properties(p), rel_kind:labels(p)[0], rel:properties(t)} AS SelectNodes
    `
    session.run(selectquery).then((results) => {const selectArray = results.records.map((record) => record.get('SelectNodes')); this.setState ({ selectArray });
    this.breadCrumbChainer();
    session.close()});
  };

//QUERY FOR SELECTED NODE + REDUCE BREADCRUMB (CLICK IN POPUP CONTENT)
export function selectSwitchReduce(event, order) {
    this.setState({nodeSelect: event});
    const session = this.driver.session()
    const selectquery = `
    MATCH (n)-[t]-(p:Person) WHERE ID(n) =` + event +` RETURN {key:id(n), select_node:properties(n), key2:id(p), node2:properties(p), rel_kind:labels(p)[0], rel:properties(t)} AS SelectNodes
    UNION MATCH (n)-[t]-(p:CorporateEntity) WHERE ID(n) =` + event +` RETURN {key:id(n), select_node:properties(n), key2:id(p), node2:properties(p), rel_kind:labels(p)[0], rel:properties(t)} AS SelectNodes
    UNION MATCH (n)-[t]-(p:Institution) WHERE ID(n) =` + event +` RETURN {key:id(n), select_node:properties(n), key2:id(p), node2:properties(p), rel_kind:labels(p)[0], rel:properties(t)} AS SelectNodes
    UNION MATCH (n)-[t]-(p:Event) WHERE ID(n) =` + event +` RETURN {key:id(n), select_node:properties(n), key2:id(p), node2:properties(p), rel_kind:labels(p)[0], rel:properties(t)} AS SelectNodes
    `
    session.run(selectquery).then((results) => {const selectArray = results.records.map((record) => record.get('SelectNodes')); this.setState ({ selectArray });
    this.breadCrumbReducer(event, order);
    session.close()});
  };

//QUERY FOR SELECTED NODE + APPEND BREADCRUMB + OPEN POPUP (CLICK IN CHILD VIEW)
export function selectSwitchInitial(event) {
    this.selectSwitchAppend(event)
    this.setState ({ popupcontainer: "popupcontainer" });
  };



/////////////////////////////////////////////////////////////////////////////////////////////////////
// QUERIES FOR FETCHING FILTER INDEXES ON LOAD //////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

//QUERY TO FETCH LISTS FOR NETWORK SELECTS
export function fetchNetworkIndexes() {
  const session = this.driver.session();
  const query = `MATCH (p:Person) WHERE p.family_name_western IS NOT NULL
    RETURN DISTINCT {value:ID(p), label:p.given_name_western + ' ' + p.family_name_western} AS List`
  session.run(query).then((results) => {
    const netPersonIndex = results.records.map((record) => record.get('List'));
    this.setState ({ netPersonIndex })
    session.close()})
};

//QUERY TO FETCH LISTS FOR MAP SELECTS
export function fetchMapIndexes() {

  //GET CATEGORY AND SUBCATEGORY LISTS
  const session = this.driver.session();
  const query = `MATCH (i:Institution)-[]-(l) WHERE i.institution_category IS NOT NULL AND (l:Township OR l:Village OR l:County OR l:Prefecture OR l:Province)
    CALL {
      WITH i
      MATCH (o:Institution) WHERE (o.institution_category = i.institution_category) AND o.institution_subcategory IS NOT NULL
      RETURN collect(distinct o.institution_subcategory) as y
    }
    RETURN DISTINCT {category:i.institution_category, subcategory:y} as List`
  session.run(query).then((results) => {
    const resultIndex = results.records.map((record) => record.get('List'));
    const addAll = [{category: "All", subcategory:["All"]}];
    const test = addAll.concat(resultIndex);
    const instCatsIndex = test.map( (i) =>[i.category, i.subcategory]);
    this.setState ({ instCatsIndex });
    session.close()});

  //GET INST AFFILIATION LIST
  const session2 = this.driver.session();
  const query2 = `
    MATCH (r:Institution)-[t:PART_OF]->(e:CorporateEntity)
    WITH r,t,e MATCH (r)-[]->(l) WHERE (l:Township OR l:Village OR l:County OR l:Prefecture OR l:Province)
    RETURN DISTINCT {value:e.name_western} AS List`
  session2.run(query2).then((results) => {
    const resultIndex2 = results.records.map((record) => record.get('List')); const addAll2 = [{value: "All"}];
    const affIndex = addAll2.concat(resultIndex2);
    this.setState ({ affIndex });
    session2.close()});

  //GET RELIGIOUS FAMILY LIST
  const session3 = this.driver.session();
  const query3 = `MATCH (r:Institution)-[]->(e:CorporateEntity) WHERE e.religious_family IS NOT NULL
    WITH r,e MATCH (r)-[]->(l) WHERE (l:Township OR l:Village OR l:County OR l:Prefecture OR l:Province)
    RETURN DISTINCT {value:e.religious_family} AS List`
  session3.run(query3).then((results) => {
    const resultIndex3 = results.records.map((record) => record.get('List')); const addAll3 = [{value: "All"}];
    const relFamIndex = addAll3.concat(resultIndex3);
    this.setState ({ relFamIndex });
    session3.close()});

  //NATIONALITY INDEX
  const session4 = this.driver.session();
  const query4 = `MATCH (r:Person)-[]->(e:Institution) WHERE r.nationality IS NOT NULL
    WITH r,e MATCH (e)-[]->(l) WHERE (l:Township OR l:Village OR l:County OR l:Prefecture OR l:Province)
    RETURN DISTINCT {value:r.nationality} AS List`
  session4.run(query4).then((results) => {
    const resultIndex4 = results.records.map((record) => record.get('List')); const addAll4 = [{value: "All"}];
    const natIndex = addAll4.concat(resultIndex4);
    this.setState ({ natIndex });
    session4.close()});

  //PERSON AFFILIATION INDEX
  const session5 = this.driver.session();
  const query5 = `MATCH (r:Person)-[]->(e:Institution)-[]->(c:CorporateEntity)
    WITH r,e,c MATCH (e)-[]->(l) WHERE (l:Township OR l:Village OR l:County OR l:Prefecture OR l:Province)
    RETURN DISTINCT {value:c.name_western} AS List`
  session5.run(query5).then((results) => {
    const resultIndex5 = results.records.map((record) => record.get('List')); const addAll5 = [{value: "All"}];
    const pAffIndex = addAll5.concat(resultIndex5);
    this.setState ({ pAffIndex });
    session5.close()});

};
