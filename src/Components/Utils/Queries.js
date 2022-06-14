/////////////////////////////////////////////////////////////////////////////////////////////////////
// IMPORTS //////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

import locations from "../../Assets/indexes/location-index.json"
import translate from "../../Assets/indexes/translate.json"

/////////////////////////////////////////////////////////////////////////////////////////////////////
// MAIN SEARCH & FILTER QUERIES /////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////



// QUERY TO FETCH RESULTS FOR SEARCH ////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
export function fetchSearch() {
  if (this.state.search !== "") {
  this.setState ({ content: "loading" })
  const session = this.driver.session();
  const searchProp = this.state.search.replace(/[\(\)\[\]\{\}\.\\\/\-\_\^\~\`\|\^\*\^\"\"/'/']/g, " ");

  const query = `
  CALL db.index.fulltext.queryNodes("allPropIndex", "`+ searchProp +`~") YIELD node
  WITH node MATCH (node)-[t]-(m)
  RETURN {key:id(node), properties:properties(node), label:labels(node)[0], rel:t.rel_type, other:properties(m), start_year:t.start_year, end_year:t.end_year} as Nodes LIMIT 300
  UNION
  MATCH (node)-[t]-(m) WHERE (any(prop in keys(m) WHERE m[prop] =~ '(?i).*`+ searchProp +`.*'))
  RETURN {key:id(node), properties:properties(node), label:labels(node)[0], rel:t.rel_type, other_label:labels(m)[0], other:properties(m), start_year:t.start_year, end_year:t.end_year} as Nodes LIMIT 300
    `
  console.log(query);
  session
  .run(query)
  .then((results) => {
    this.setState ({ nodeArray: [], filterArray: [], genderList: [], nationalityList: [], labelList: [], relFamList: [], christTradList: [], instCatList: [], instSubCatList: [], corpCatList: [], corpSubCatList: [], eventCatList: [], eventSubCatList: [], affList: [] });
    this.setState ({ label: "", nationality: "", gender: "", religious_family: "", christian_tradition: "", institution_category: "", institution_subcategory: "", corporate_entity_category: "", corporate_entity_subcategory: "", event_category: "", event_subcategory: "", name_western: "", inst_name_western: "" });

    const nodeArray = results.records.map((record) => record.get('Nodes'));
    if (nodeArray.length === 0) {this.setState ({ noresults: "noresults" }); this.setState ({ content: "loaded" }); this.setState ({ searchSet: this.state.search })}

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
      this.setState ({ searchSet: this.state.search })
    }
    session.close()})
  } else {}
}



// QUERY TO FETCH RESULTS FOR MAP ///////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
export function fetchResults() {
  if (
    this.state.family_name_western === "" &&
    this.state.given_name_western === "" &&
    this.state.name_western === "" &&
    this.state.institution_category === "All" &&
    this.state.institution_subcategory === "All" &&
    this.state.event_category === "All" &&
    this.state.event_subcategory === "All" &&
    this.state.gender === "All" &&
    this.state.nationality === "All" &&
    this.state.affiliation === "All" &&
    this.state.religious_family === "All" &&
    this.state.start_year === "" &&
    this.state.end_year === "" ) {
      this.setState ({nosend: "nosend"})
  } else {
    this.setState ({ content: "loading" })
    const session = this.driver.session();

    //CONSTRUCT FILTERS FROM USER INPUT

    let personNameFilter;
    if (this.state.family_name_western === "" && this.state.given_name_western === "") {personNameFilter = ""}
    else if (this.state.family_name_western !== "" && this.state.given_name_western === "") {personNameFilter = '(toLower(n.family_name_western)=~ "(?i)' + this.state.family_name_western.replace(/[\(\)\[\]\{\}\.\\\/\-\_\^\~\`\|\^\*\^\"\"/'/']/g, " ") + '" OR toLower(n.family_name_western)=~ "(?i)' + this.state.family_name_western.replace(/[\(\)\[\]\{\}\.\\\/\-\_\^\~\`\|\^\*\^\"\"/'/']/g, " ") + '.*")'}
    else if (this.state.family_name_western === "" && this.state.given_name_western !== "") {personNameFilter = '(toLower(n.given_name_western)=~ "(?i)' + this.state.given_name_western.replace(/[\(\)\[\]\{\}\.\\\/\-\_\^\~\`\|\^\*\^\"\"/'/']/g, " ") + '" OR toLower(n.given_name_western)=~ "(?i)' + this.state.given_name_western.replace(/[\(\)\[\]\{\}\.\\\/\-\_\^\~\`\|\^\*\^\"\"/'/']/g, " ") + '.*")'}
    else if (this.state.family_name_western !== "" && this.state.given_name_western !== "") {personNameFilter = '(toLower(n.family_name_western)=~ "(?i)' + this.state.family_name_western.replace(/[\(\)\[\]\{\}\.\\\/\-\_\^\~\`\|\^\*\^\"\"/'/']/g, " ") + '" OR toLower(n.family_name_western)=~ "(?i)' + this.state.family_name_western.replace(/[\(\)\[\]\{\}\.\\\/\-\_\^\~\`\|\^\*\^\"\"/'/']/g, " ") + '.*") AND (toLower(n.given_name_western)=~ "(?i)' + this.state.given_name_western.replace(/[\(\)\[\]\{\}\.\\\/\-\_\^\~\`\|\^\*\^\"\"/'/']/g, " ") + '" OR toLower(n.given_name_western)=~ "(?i)' + this.state.given_name_western.replace(/[\(\)\[\]\{\}\.\\\/\-\_\^\~\`\|\^\*\^\"\"/'/']/g, " ") + '.*")'}

    let personNameFilter2;
    if (this.state.sent_id !== "init" && this.state.kind === "People") {personNameFilter2 = " AND " + personNameFilter }
    else if (this.state.start_year !== "" | this.state.end_year !== "" && personNameFilter !== "" ) {personNameFilter2 = " AND " + personNameFilter }
    else if (personNameFilter === "" ) {personNameFilter2 = "" }
    else {personNameFilter2 = " WHERE " + personNameFilter }

    let nameFilter2;
    if (this.state.name_western !== "") {nameFilter2 = 'AND (toLower(r.name_western)= "(?i)' + this.state.name_western.replace(/[\(\)\[\]\{\}\.\\\/\-\_\^\~\`\|\^\*\^\"\"/'/']/g, " ") + '" OR toLower(r.name_western)=~ "(?i)' + this.state.name_western.replace(/[\(\)\[\]\{\}\.\\\/\-\_\^\~\`\|\^\*\^\"\"/'/']/g, " ") + '.*")'}
    else { nameFilter2 = ""};

    let icatFilter; if (this.state.institution_category === "All") { icatFilter = ""} else if (this.state.institution_category !== "All" || this.state.institution_category !== "" ) {icatFilter = 'institution_category: "' + this.state.institution_category + '"'} else { icatFilter = ""};

    let isubcatFilter; if (this.state.institution_subcategory === "All") { isubcatFilter = ""} else if (this.state.institution_subcategory !== "All" || this.state.institution_subcategory !== "" ) {isubcatFilter = 'institution_subcategory: "' + this.state.institution_subcategory + '"'} else { isubcatFilter = ""};

    let genderFilter; if (this.state.gender !== "All") {genderFilter = 'gender: "' + this.state.gender + '"'} else { genderFilter = ""};

    let nationalityFilter; if (this.state.nationality === "All") {nationalityFilter =""} else if (this.state.nationality !== "") {nationalityFilter = 'nationality: "' + this.state.nationality + '"'} else { nationalityFilter = ""};

    let affFilter;  if (this.state.affiliation === "All") {affFilter =""} else if (this.state.affiliation !== "All" || this.state.affiliation !== "") {affFilter = 'name_western: "' + this.state.affiliation + '"'} else { affFilter = ""};
    let relFamFilter; if (this.state.religious_family !== "All") {relFamFilter = 'religious_family: "' + this.state.religious_family + '"'} else { relFamFilter = ""};

    let locatArray = [];
    for (let i=0; i < locations.length; i++) {
       if (locations[i].name_zh === this.state.location) {
         locatArray = '"' + locations[i].contains.join('", "') + '"'}
       }

    let locatFilter;
    if (locatArray.length >= 1) { locatFilter = ' AND l.id IN ['+ locatArray +']'}
    else {locatFilter = " "}


    let timeFilter;
      if (this.state.start_year !== "" && this.state.end_year !== "") {timeFilter = ' WHERE ((t.start_year <= ' + this.state.end_year + ') AND (t.end_year >=' + this.state.start_year + ')) OR t.start_year IS NULL'}
      else if (this.state.start_year === "" && this.state.end_year !== "") {timeFilter = ' WHERE (t.start_year <= ' + this.state.end_year + ') OR t.start_year IS NULL'}
      else if (this.state.start_year !== "" && this.state.end_year === "") {timeFilter = ' WHERE (t.start_year >= ' + this.state.start_year + ') OR t.start_year IS NULL'}
      else { timeFilter = ""};

    let keyFilter;
      if (this.state.sent_id !== "init" && this.state.kind === "People" ) {
        if (timeFilter !== "") {keyFilter = ' AND ID(n)=' + this.state.sent_id }
        else {keyFilter = ' WHERE ID(n)=' + this.state.sent_id }
      }
      else if (this.state.sent_id !== "init" && this.state.kind === "Institutions" && this.state.affiliation === "All" ) {
        if (timeFilter !== "") {keyFilter = ' AND ID(r)=' + this.state.sent_id }
        else {keyFilter = ' WHERE ID(r)=' + this.state.sent_id }
      }
      else {keyFilter = ""}

    //CONCAT & CLEAN FILTERS
    const filterStatic = [genderFilter, nationalityFilter]
    const filterStaticClean = filterStatic.filter(value => value.length > 1).join();

    const corpFilterStatic = [relFamFilter, affFilter]
    const corpFilterStaticClean = corpFilterStatic.filter(value => value.length > 1).join();
    const instFilterStatic = [icatFilter, isubcatFilter]
    const instFilterStaticClean = instFilterStatic.filter(value => value.length > 1).join();

    let unAffFilter;
    if (this.state.sent_id !== "init" && this.state.kind === "People" && this.state.affiliation === "All") {
      unAffFilter = `UNION MATCH (n:Person {`+ filterStaticClean +`})-[t]-(r:Institution)`+ timeFilter + keyFilter + personNameFilter2 +`
      WITH n,r,t
      MATCH (r)-[]->(l) WHERE (l:Township OR l:Village OR l:County OR l:Prefecture OR l:Province) `+ locatFilter +`
      RETURN {key:id(n),properties:properties(n),inst:properties(r),aff:properties(r),locat:properties(l),rel:properties(t),locat_name:properties(l).name_wes} AS Nodes`
    }
    else {unAffFilter = ""}

    //CONSTRUCT QUERY WITH VARIABLES
    let query;
    if (this.state.kind === "People") {
        const query = `
          MATCH (n:Person {`+ filterStaticClean +`})-[t]-(r:Institution)-[]-(e:CorporateEntity {`+ affFilter +`})`+ timeFilter + keyFilter + personNameFilter2 +`
          WITH n,r,e,t
          MATCH (r)-[]->(l) WHERE (l:Township OR l:Village OR l:County OR l:Prefecture OR l:Province)`+ locatFilter +`
          RETURN {key:id(n),properties:properties(n),inst:properties(r),aff:properties(e),locat:properties(l),rel:properties(t),locat_name:properties(l).name_wes} AS Nodes
          `+ unAffFilter +`
          UNION MATCH (e:CorporateEntity {`+ affFilter +`})-[]-(n:Person {`+ filterStaticClean +`})-[t]-(r:Institution)`+ timeFilter + keyFilter + personNameFilter2 +`
          WITH n,r,e,t
          MATCH (r)-[]->(l) WHERE (l:Township OR l:Village OR l:County OR l:Prefecture OR l:Province)`+ locatFilter +`
          RETURN {key:id(n),properties:properties(n),inst:properties(r),aff:properties(e),locat:properties(l),rel:properties(t),locat_name:properties(l).name_wes} AS Nodes

          `
          console.log(query)
          session
          .run(query)
          .then((results) => {
            let unfiltArray = results.records.map((record) => record.get('Nodes'));
            let nodeArray = unfiltArray.filter(node => node.locat.latitude && node.locat.longitude);
            if (nodeArray.length === 0) {
              this.setState ({ noresults: "noresults" });
              this.setState ({ content: "loaded" });
            }
            else {
              const mapBounds = nodeArray.map(node => ([node.locat.latitude,node.locat.longitude]));
              this.setState ({ nodeArray })
              this.setState ({ mapBounds });
              this.setState ({noresults: "noresults hide"});
              this.setState ({ content: "loaded" });
              this.setState ({sent_id: "init"});
            }
            session.close()})

    } else if (this.state.kind === "Institutions") {
        const query = `
          MATCH (r:Institution {`+ instFilterStaticClean +`})-[q]-(e:CorporateEntity {`+ corpFilterStaticClean +`})`+ timeFilter + keyFilter +`
          WITH q,r,e MATCH (r)-[]->(l) WHERE (l:Township OR l:Village OR l:County OR l:Prefecture OR l:Province)`+ locatFilter + nameFilter2 +`
          RETURN {key:id(r),properties:properties(r),aff:properties(e),locat:properties(l),rel:properties(q),locat_name:properties(l).name_wes} AS Nodes
          UNION MATCH (r:Institution {`+ instFilterStaticClean +`})-[q*2]-(e:CorporateEntity {`+ corpFilterStaticClean +`})`+ timeFilter + keyFilter +`
          WITH q,r,e MATCH (r)-[]->(l) WHERE (l:Township OR l:Village OR l:County OR l:Prefecture OR l:Province)`+ locatFilter + nameFilter2 +`
          RETURN {key:id(r),properties:properties(r),aff:properties(e),locat:properties(l),rel:properties(q[1]),locat_name:properties(l).name_wes} AS Nodes
          `
          console.log(query)
          session.run(query).then((results) => {
            let unfiltArray = results.records.map((record) => record.get('Nodes'));
            let nodeArray;
              if (this.state.location !== "All" && this.state.location !== "都" ) { nodeArray = unfiltArray.filter(e => locatFilter[0].includes(e.locat.name_zh)).filter(node => node.locat.latitude && node.locat.longitude)}
              else {nodeArray = unfiltArray.filter(node => node.locat.latitude && node.locat.longitude)};
            if (nodeArray.length === 0) {
              this.setState ({ noresults: "noresults" });
              this.setState ({ content: "loaded" });
            }
            else {
              const mapBounds = nodeArray.map(node => ([node.locat.latitude,node.locat.longitude]));
              this.setState ({ nodeArray });
              this.setState ({ mapBounds });
              this.setState ({noresults: "noresults hide"});
              this.setState ({ content: "loaded" });
              this.setState ({sent_id: "init"});
            }
            session.close()})
     } else if (this.state.kind === "Events") {
         const query = `
           MATCH (r:Event {`+ instFilterStaticClean +`})-[t]-(l)`+ timeFilter + keyFilter +`
           WITH r,t,l MATCH (r)-[t]->(l) WHERE (l:Township OR l:Village OR l:County OR l:Prefecture OR l:Province)`+ locatFilter + nameFilter2 +`
           RETURN {key:id(r),properties:properties(r),locat:properties(l),rel:properties(t),locat_name:properties(l).name_wes} AS Nodes
           `
           console.log(query)
           session.run(query).then((results) => {
             let unfiltArray = results.records.map((record) => record.get('Nodes'));
             let nodeArray = unfiltArray.filter(node => node.locat.latitude && node.locat.longitude);
             if (nodeArray.length === 0) {
               this.setState ({ noresults: "noresults" });
               this.setState ({ content: "loaded" });
             }
             else {
               const mapBounds = nodeArray.map(node => ([node.locat.latitude,node.locat.longitude]));
               this.setState ({ nodeArray });
               this.setState ({ mapBounds });
               this.setState ({noresults: "noresults hide"});
               this.setState ({ content: "loaded" });
               this.setState ({sent_id: "init"});
             }
             session.close()})
      }

  }
};


//QUERIES FOR NETWORK GRAPH  ////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

//QUERY FOR NETWORK GRAPH TIME CONFINES
export function fetchNetworkConfines() {
  if (this.state.node_id === "" && this.state.nodeSelect === "") {return null}
  else {
    let nodeIdFilter;
      if (this.state.node_id !== "") {
        nodeIdFilter = 'WHERE id(n) ='+ parseFloat(this.state.node_id) +' '
      } else { nodeIdFilter = ""};
      const session = this.driver.session();
      const query = `
        MATCH (n)-[t]-(o)`+ nodeIdFilter +`
        WITH collect(n.birth_year)+collect(n.death_year)+collect(DISTINCT t.start_year)+collect(DISTINCT t.end_year) as list
        UNWIND list as years
        WITH years ORDER BY years
        WITH (head(collect(distinct years))) as head, (last(collect(distinct years))) as last
        RETURN {start:head, end:last} as Confines
        `
        session.run(query).then((results) => {
          const networkConfines = results.records.map((record) => record.get('Confines'));
          let start;
          let end;
          if (this.state.start_year === "") {start = networkConfines[0].start } else {start = this.state.start_year}
          if (this.state.end_year === "") {end = networkConfines[0].end } else {end = this.state.end_year}
          this.setState ({ start_year: start })
          this.setState ({ end_year: end })
          this.setState ({ time_disable: false })
          session.close()});
  }
};

//QUERY FOR NETWORK GRAPH RESULTS
export function fetchNetworkResults() {
  if (this.state.node_id === "" && this.state.nodeSelect === "") {
      this.setState ({nosend: "nosend"})
  }
  else {
    this.setState ({ content: "loading" });
    this.setState ({ nodeArray: [] });

    //SET CENTRAL NODE
    let nodeIdFilter;
      if (this.state.node_id !== "") {
        nodeIdFilter =  ''+ parseFloat(this.state.node_id) +' '
      } else { nodeIdFilter = ""};

    //SET NETWORK CONFINES
    let start;
    let end;

    const session1 = this.driver.session();
    const query2 = `
      MATCH (n)-[t]-(o) WHERE id(n)=`+ nodeIdFilter +`
      WITH collect(n.birth_year)+collect(n.death_year)+collect(DISTINCT t.start_year)+collect(DISTINCT t.end_year) as list
      UNWIND list as years
      WITH years ORDER BY years
      WITH (head(collect(distinct years))) as head, (last(collect(distinct years))) as last
      RETURN {start:head, end:last} as Confines
      `
      session1.run(query2).then((results) => {
        const networkConfines = results.records.map((record) => record.get('Confines'));
        if (this.state.start_year === "") {start = networkConfines[0].start } else {start = this.state.start_year}
        if (this.state.end_year === "") {end = networkConfines[0].end } else {end = this.state.end_year}
        this.setState ({ start_year: start })
        this.setState ({ end_year: end })
        this.setState ({ time_disable: false })
        session1.close()});

    //CONSTRUCT FILTERS FROM USER INPUT
    let degreeFilter; if (this.state.degree !== 1) {degreeFilter = this.state.degree} else { degreeFilter = 1};
    let peopleFilter; if (this.state.people_include === true) {peopleFilter = "+"} else {peopleFilter = "-"}
    let instFilter; if (this.state.inst_include === true) {instFilter = "+"} else {instFilter = "-"}
    let corpFilter; if (this.state.corp_include === true) {corpFilter = "+"} else {corpFilter = "-"}
    let eventFilter; if (this.state.event_include === true) {eventFilter = "+"} else {eventFilter = "-"}

    //CONCAT FILTERS
    const filterStatic = [nodeIdFilter]
    const filterStaticClean = filterStatic.filter(value => value.length > 1).join();

    //CONSTRUCT QUERY WITH VARIABLES
    const session = this.driver.session();

    let startFilter;
    let endFilter;
    if (this.state.end_year === "") {endFilter = "last"} else {endFilter = this.state.end_year}
    if (this.state.start_year === "") {startFilter = "head"} else {startFilter = this.state.start_year}

    const query = `
    MATCH (n)-[t]-(o) WHERE id(n)=`+ nodeIdFilter +`
      WITH collect(n.birth_year)+collect(n.death_year)+collect(DISTINCT t.start_year)+collect(DISTINCT t.end_year) as list
      UNWIND list as years
      WITH years ORDER BY years
      WITH (head(collect(distinct years))) as head, (last(collect(distinct years))) as last
    MATCH (n)-[t]-(o) WHERE id(n)=`+ nodeIdFilter +`
        CALL apoc.path.subgraphAll(n, {
          maxLevel:`+degreeFilter+`,
          labelFilter:"`+ peopleFilter +`Person|`+ instFilter +`Institution|`+ corpFilter +`CorporateEntity|`+ eventFilter +`Event|-Village|-Township|-County|-Prefecture|-Province"
              })
        YIELD nodes, relationships
        UNWIND nodes AS ender
        WITH ender, head, last
    MATCH (ender:Person)-[p]-(q) WHERE p.start_year >= `+ endFilter +` OR p.end_year <= `+ startFilter +`
        WITH collect(ender) AS endNodes
    MATCH (y)-[k]-(j) WHERE id(y)=`+ nodeIdFilter +`
        CALL apoc.path.subgraphAll(y, {
                maxLevel:`+degreeFilter+`,
                labelFilter:"+Person|+Institution|-CorporateEntity|-Event|-Village|-Township|-County|-Prefecture|-Province",
                blacklistNodes: endNodes
              })
        YIELD nodes, relationships
      WITH [node in nodes | node {key:id(node), label:labels(node)[0], properties:properties(node)}] as nodes,
           [rel in relationships | rel {source:id(startNode(rel)), target:id(endNode(rel)), start_year:rel.start_year, end_year:rel.end_year}] as rels
      RETURN {nodes:nodes, links:rels} as Graph
      `
      console.log(query)
      session
      .run(query)
      .then((results) => {
        const newArray = results.records.map((record) => record.get('Graph'));
        let ulinks = newArray[0].links;
        let links = [];
        for (let i = 0; i < ulinks.length; i++) {
          if ((
                (this.state.start_year !== "" && this.state.end_year !== "") &&
                (ulinks[i].start_year >= this.state.start_year && ulinks[i].end_year <= this.state.end_year && ulinks[i].start_year <= this.state.end_year || ulinks[i].end_year === null && ulinks[i].start_year === null)
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
    MATCH (n)-[t]-(p:Person) WHERE ID(n) =` + event +` RETURN {key:id(n), select_kind:labels(n)[0], select_node:properties(n), key2:id(p), node2:properties(p), rel_kind:labels(p)[0], rel:properties(t), rel_locat:"none"} AS SelectNodes ORDER BY SelectNodes.rel.start_year
    UNION MATCH (n)-[t]-(p:CorporateEntity) WHERE ID(n) =` + event +` RETURN {key:id(n), select_kind:labels(n)[0], select_node:properties(n), key2:id(p), node2:properties(p), rel_kind:labels(p)[0], rel:properties(t), rel_locat:"none"} AS SelectNodes ORDER BY SelectNodes.rel.start_year
    UNION MATCH (n)-[t]-(p:Event) WHERE ID(n) =` + event +` RETURN {key:id(n), select_kind:labels(n)[0], select_node:properties(n), key2:id(p), node2:properties(p), rel_kind:labels(p)[0], rel:properties(t), rel_locat:"none"} AS SelectNodes ORDER BY SelectNodes.rel.start_year
    UNION MATCH (n)-[t]-(p:Institution)-[q]-(l) WHERE ID(n) =` + event +`
      CALL {
        WITH q
        RETURN q.notes
      }
    RETURN {key:id(n), select_kind:labels(n)[0], select_node:properties(n), key2:id(p), node2:properties(p), rel_kind:labels(p)[0], rel:properties(t), rel_locat: apoc.convert.toString(collect(DISTINCT q.notes))} AS SelectNodes
    ORDER BY SelectNodes.rel.start_year IS NULL
    `
    console.log(selectquery)
    session.run(selectquery).then((results) => {const selectArray = results.records.map((record) => record.get('SelectNodes')); this.setState ({ selectArray });
    this.breadCrumbChainer();
    session.close()});
  };

//QUERY FOR SELECTED NODE + REDUCE BREADCRUMB (CLICK IN POPUP CONTENT)
export function selectSwitchReduce(event, order) {
    this.setState({nodeSelect: event});
    const session = this.driver.session()
    const selectquery = `
    MATCH (n)-[t]-(p:Person) WHERE ID(n) =` + event +` RETURN {key:id(n), select_kind:labels(n)[0], select_node:properties(n), key2:id(p), node2:properties(p), rel_kind:labels(p)[0], rel:properties(t), rel_locat:"none"} AS SelectNodes ORDER BY SelectNodes.rel.start_year
    UNION MATCH (n)-[t]-(p:CorporateEntity) WHERE ID(n) =` + event +` RETURN {key:id(n), select_kind:labels(n)[0], select_node:properties(n), key2:id(p), node2:properties(p), rel_kind:labels(p)[0], rel:properties(t), rel_locat:"none"} AS SelectNodes ORDER BY SelectNodes.rel.start_year
    UNION MATCH (n)-[t]-(p:Event) WHERE ID(n) =` + event +` RETURN {key:id(n), select_kind:labels(n)[0], select_node:properties(n), key2:id(p), node2:properties(p), rel_kind:labels(p)[0], rel:properties(t), rel_locat:"none"} AS SelectNodes ORDER BY SelectNodes.rel.start_year
    UNION MATCH (n)-[t]-(p:Institution)-[q]-(l) WHERE ID(n) =` + event +`
      CALL {
        WITH q
        RETURN q.notes
      }
    RETURN {key:id(n), select_kind:labels(n)[0], select_node:properties(n), key2:id(p), node2:properties(p), rel_kind:labels(p)[0], rel:properties(t), rel_locat: apoc.convert.toString(collect(DISTINCT q.notes))} AS SelectNodes
    ORDER BY SelectNodes.rel.start_year IS NULL
    `
    console.log(selectquery)
    session.run(selectquery).then((results) => {const selectArray = results.records.map((record) => record.get('SelectNodes')); this.setState ({ selectArray });
    this.breadCrumbReducer(event, order);
    session.close()});
  };

//QUERY FOR SELECTED NODE + APPEND BREADCRUMB + OPEN POPUP (CLICK IN CHILD VIEW)
export function selectSwitchInitial(event) {
    this.selectSwitchAppend(event)
    if (this.state.filterDisplay === "filter_container") {this.setState ({ popupcontainer: "popupcontainer" })}
    else if (this.state.filterDisplay === "filter_container2") {this.setState ({ popupcontainer: "popupcontainer-full" })}
  };



/////////////////////////////////////////////////////////////////////////////////////////////////////
// QUERIES FOR FETCHING FILTER INDEXES ON LOAD //////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

//QUERY TO FETCH LISTS FOR NETWORK SELECTS
export function fetchNetworkIndexes() {
    if (this.state.inputValue !== '') {
      let value = this.state.inputValue.replace(/[\(\)\[\]\{\}\.\\\/\-\_\^\~\`\|\^\*\^\"\"/'/']/g, " ");;
      let nodeType = this.state.selectedOption
      if (nodeType === "Person") {
        const session = this.driver.session();
        const query = `
          CALL db.index.fulltext.queryNodes("allPropIndex", "`+ value +`~") YIELD node
          WITH node MATCH (node:` + nodeType +`)
          RETURN DISTINCT {type:"node_id", value:ID(node), label:node.given_name_western + ' ' + node.family_name_western} AS List
          `
        session.run(query).then((results) => {
          const nodeData = results.records.map((record) => record.get('List'));
          const netPersonIndex = nodeData.map(i => ({ label: i.label, value: i.value, type: "node_id" }));
          this.setState ({ netPersonIndex })
          return (this.state.netPersonIndex)
          session.close()});
      } else {
        const session = this.driver.session();
        const query = `
          CALL db.index.fulltext.queryNodes("allPropIndex", "`+ value +`~") YIELD node
          WITH node MATCH (node:` + nodeType +`)
          RETURN DISTINCT {type:"node_id", value:ID(node), label:node.name_western} AS List
          `
        session.run(query).then((results) => {
          const nodeData = results.records.map((record) => record.get('List'));
          const netPersonIndex = nodeData.map(i => ({ label: i.label, value: i.value, type: "node_id" }));
          this.setState ({ netPersonIndex })
          return (this.state.netPersonIndex)
          session.close()});
      };
    } else {return null}
return (this.state.netPersonIndex)
};


//PERSON AFFILIATION INDEX
export function fetchPAffIndex() {
  if (this.state.inputValuePAff !== '') {
    let value = this.state.inputValuePAff.replace(/[\(\)\[\]\{\}\.\\\/\-\_\^\~\`\|\^\*\^\"\"/'/']/g, " ");;
    const session5 = this.driver.session();
    const query5 = `
      CALL db.index.fulltext.queryNodes("corpPropIndex", "`+ value +`~") YIELD node
      WITH node
      MATCH (node:CorporateEntity {corporate_entity_category: "Religious Body"})-[]-(e)
      RETURN DISTINCT {type:"affiliation", value:node.name_western, label:node.name_western, zh:node.chinese_name_hanzi} AS List
      `
    console.log(query5)
    session5.run(query5).then((results) => {
      const resultIndex5 = results.records.map((record) => record.get('List')); const addAll5 = [{value: "All", en:"All", zh:"全部", tw:"全部"}];
      const pAffIndexPrep = addAll5.concat(resultIndex5);
      const pAffIndex = pAffIndexPrep.map(i => ({ label: i.value+` `+i.zh, value: i.value, zh: i.zh, tw: i.zh, en: i.value, type: "affiliation" }));
      this.setState ({ pAffIndex });
      return (this.state.pAffIndex)
    session5.close()});
  } else {return null}
  return (this.state.pAffIndex)
};

//INSTITUTION AFFILIATION INDEX
export function fetchAffIndex() {
  if (this.state.inputValueAff !== '') {
    let value = this.state.inputValueAff.replace(/[\(\)\[\]\{\}\.\\\/\-\_\^\~\`\|\^\*\^\"\"/'/']/g, " ");;
    const session5 = this.driver.session();
    const query5 = `
      CALL db.index.fulltext.queryNodes("corpPropIndex", "`+ value +`~") YIELD node
      WITH node
      MATCH (node:CorporateEntity {corporate_entity_category: "Religious Body"})-[]-(e)
      RETURN DISTINCT {type:"affiliation", value:node.name_western, label:node.name_western, zh:node.chinese_name_hanzi} AS List
      `
    console.log(query5)
    session5.run(query5).then((results) => {
      const resultIndex5 = results.records.map((record) => record.get('List')); const addAll5 = [{value: "All", en:"All", zh:"全部", tw:"全部"}];
      const affIndexPrep = addAll5.concat(resultIndex5);
      const affIndex = affIndexPrep.map(i => ({ label: i.value+` `+i.zh, value: i.value, zh: i.zh, tw: i.zh, en: i.value, type: "affiliation" }));
      this.setState ({ affIndex });
      console.log(this.state.affIndex)
      return (this.state.affIndex)
    session5.close()});
  } else {return null}
  return (this.state.affIndex)
};

//PERSON NATIONALITY INDEX
export function fetchNatIndex() {
  if (this.state.inputValueNat !== '') {
    let value = this.state.inputValueNat.replace(/[\(\)\[\]\{\}\.\\\/\-\_\^\~\`\|\^\*\^\"\"/'/']/g, " ");;
    const session5 = this.driver.session();
    const query5 = `
      CALL db.index.fulltext.queryNodes("allPropIndex", "`+ value +`~") YIELD node
      WITH node MATCH (node:Person) WHERE node.nationality IS NOT NULL
      RETURN DISTINCT {type:"affiliation", value:node.nationality, label:node.nationality} AS List
      `
    console.log(query5)
    session5.run(query5).then((results) => {
      const resultIndex5 = results.records.map((record) => record.get('List')); const addAll5 = [{value: "All"}];
      const natIndexPrep = addAll5.concat(resultIndex5);
      const natIndex = natIndexPrep.map(i => ({ label: i.value, value: i.value, type: "nationality" }));
      this.setState ({ natIndex });
      console.log(this.state.natIndex)
      return (this.state.natIndex)
    session5.close()});
  } else {return null}
  return (this.state.natIndex)
};


//QUERY TO FETCH LISTS FOR MAP SELECTS
export function fetchMapIndexes() {

  //GET CATEGORY AND SUBCATEGORY LISTS
  const session = this.driver.session();
  const query = `MATCH (p:Institution) WHERE NOT p.institution_category = "General Area" AND p.institution_category IS NOT NULL
    CALL {
      WITH p
      RETURN p.institution_subcategory
    }
    RETURN {category: p.institution_category, subcategory:collect (distinct  p.institution_subcategory)} as List
      `
  session.run(query).then((results) => {
    const resultIndex = results.records.map((record) => record.get('List'));
    const addAll = [{category: "All", subcategory:["All"]}];
    const test = addAll.concat(resultIndex);
    const instCatsIndex = test.map( (i) =>[i.category, i.subcategory]);
    this.setState ({ instCatsIndex });
    session.close()});

  //GET RELIGIOUS FAMILY LIST
  const session3 = this.driver.session();
  const query3 = `MATCH (r:Institution)-[]->(e:CorporateEntity) WHERE e.religious_family IS NOT NULL
    RETURN DISTINCT {value:e.religious_family} AS List`
  session3.run(query3).then((results) => {
    const resultIndex3 = results.records.map((record) => record.get('List')); const addAll3 = [{value: "All"}];
    const relFamIndexPrep = addAll3.concat(resultIndex3);
    const relFamIndex = relFamIndexPrep.map(i => ({ value: i.value, type: "religious_family" }));
    this.setState ({ relFamIndex });
    session3.close()});

  //GET CATEGORY AND SUBCATEGORY LISTS
  const session6 = this.driver.session();
  const query6 = `MATCH (p:Event) WHERE p.event_category IS NOT NULL
    WITH p MATCH (p)-[]->(l) WHERE (l:Township OR l:Village OR l:County OR l:Prefecture OR l:Province)
    CALL {
      WITH p
      RETURN p.event_subcategory
    }
    RETURN {category: p.event_category, subcategory:collect (distinct  p.event_subcategory)} as List
      `
  session6.run(query6).then((results) => {
    const resultIndex = results.records.map((record) => record.get('List'));
    const addAll = [{category: "All", subcategory:["All"]}];
    const test = addAll.concat(resultIndex);
    const eventsCatsIndex = test.map( (i) =>[i.category, i.subcategory]);
    this.setState ({ eventsCatsIndex });
    session.close()});

};

/////////////////////////////////////////////////////////////////////////////////////////////////////
// QUERIES FOR DATAVIEW /////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

//QUERY TO FETCH TOTAL PEOPLE
export function fetchTotalPeople() {
  const session = this.driver.session();
  const query = `MATCH (n:Person) RETURN count(n) AS Count`
  session.run(query).then((results) => {
    const totalPeople = results.records.map((record) => record.get('Count'));
    this.setState ({ totalPeople })
    session.close()})
};

//QUERY TO FETCH TOTAL INSTITUTIONS
export function fetchTotalInstitutions() {
  const session = this.driver.session();
  const query = `MATCH (n:Institution) RETURN count(n) AS Count`
  session.run(query).then((results) => {
    const totalInstitutions = results.records.map((record) => record.get('Count'));
    this.setState ({ totalInstitutions })
    session.close()})
};

//Total Relationships
export function fetchTotalRelationship() {
  const session = this.driver.session();
  const query = `MATCH (n)-[r]->() RETURN COUNT(r) AS Count`
  session.run(query).then((results) => {
    const totalRelationships = results.records.map((record) => record.get('Count'));
    this.setState ({ totalRelationships })
    session.close()})
};

//QUERY TO FETCH TOTAL EVENTS
export function fetchTotalEvents() {
  const session = this.driver.session();
  const query = `MATCH (n:Event) RETURN count(n) AS Count`
  session.run(query).then((results) => {
    const totalEvents = results.records.map((record) => record.get('Count'));
    this.setState ({ totalEvents })
    session.close()})
};

  export function fetchTotalNodes() {
    const session = this.driver.session();
    const query = `MATCH (n) RETURN count(n) AS Count`
    session.run(query).then((results) => {
      const totalNodes = results.records.map((record) => record.get('Count'));
      this.setState ({ totalNodes })
      session.close()})
  };

  //QUERY TO FETCH TOTAL CORPORATE ENTITIES
  export function fetchTotalCorporateEntities() {
    const session = this.driver.session();
    const query = `MATCH (n:CorporateEntity) RETURN count(n) AS Count`
    session.run(query).then((results) => {
      const totalCorporateEntities = results.records.map((record) => record.get('Count'));
      this.setState ({ totalCorporateEntities })
      session.close()})
  };

  //QUERY TO GET GENDERS OF ALL PEOPLE
  export function fetchGenders() {
    const session = this.driver.session();
    const query = `MATCH (n:Person)
      WITH n.gender AS gender, count(*) AS count
      WHERE count > 1
      RETURN DISTINCT {gender: gender, count: count} AS List
      `
    session.run(query).then((results) => {
      const genders = results.records.map((record) => record.get('List', 'gender'));
      this.setState ({ genders })
      session.close()})
  };

  //QUERY TO GET ACTIVITY FOR PROVINCES.
  export function fetchProvinces() {
    const session = this.driver.session();
    const query = `MATCH (p:Province)
        UNWIND p as x
        MATCH (x:Province)<-[:LOCATED_IN|INSIDE_OF*1..5]-(q)<-[:PRESENT_AT]-(n:Person)
        RETURN DISTINCT {Province : x.name_wes, Activity: count(n)} AS List
        ORDER BY List.Activity DESC LIMIT 10
      `
    session.run(query).then((results) => {
      const provinces = results.records.map((record) => record.get('List', 'Activity'));
      this.setState ({ provinces })
      session.close()})
  };

  //QUERY TO GET ACTIVITY FOR PREFECTURES.
  export function fetchPrefectures() {
    const session = this.driver.session();
    const query = `MATCH (p:Prefecture)
        UNWIND p as x
        MATCH (x:Prefecture)<-[:LOCATED_IN|INSIDE_OF*1..4]-(q)<-[:PRESENT_AT]-(n:Person)
        RETURN DISTINCT {Prefecture : x.name_wes, Activity: count(n)} AS List
        ORDER BY List.Activity DESC LIMIT 10
      `
    session.run(query).then((results) => {
      const prefectures = results.records.map((record) => record.get('List', 'Activity'));
      this.setState ({ prefectures })
      session.close()})
  };

  //QUERY TO GET ACTIVITY FOR COUNTIES.
  export function fetchCounties() {
    const session = this.driver.session();
    const query = `MATCH (p:County)
        UNWIND p as x
        MATCH (x:County)<-[:LOCATED_IN|INSIDE_OF*1..3]-(q)<-[:PRESENT_AT]-(n:Person)
        RETURN DISTINCT {County : x.name_wes, Activity: count(n)} AS List
        ORDER BY List.Activity DESC LIMIT 10
      `
    session.run(query).then((results) => {
      const counties = results.records.map((record) => record.get('List', 'Activity'));
      this.setState ({ counties })
      session.close()})
    };

  //Query to get Nationality of all people
  export function fetchNationality() {
    const session = this.driver.session();
    const query = `PROFILE MATCH (n:Person)
      WHERE n.nationality IS NOT NULL
      WITH n.nationality AS nationality, count(n) AS count
      WITH nationality, count ORDER BY count
      RETURN DISTINCT {nationality: nationality, count: count} AS List
    `
    session.run(query).then((results) => {
      const nationalityList = results.records.map((record) => record.get('List', 'nationality'));
      const nationality = nationalityList.filter(d => d.count >= 10)
      this.setState ({ nationality })
      session.close()})
  };

    //Query to get Nationality of all people
    export function fetchNationalityNull() {
      const session = this.driver.session();
      const query = `MATCH (n:Person)
      WITH n.nationality AS nationality, count(n) AS count
      WHERE n.nationality IS NULL
      RETURN count as Count
      `
      session.run(query).then((results) => {
        const nationalityNull = results.records.map((record) => record.get('Count', 'nationality'));
        this.setState ({ nationalityNull })
        session.close()})
    };

  //QUERY TO GET CHRISTIAN TRADITIONS OF ALL NODES
  export function fetchChristianTradition() {
    const session = this.driver.session();
    const query = `
      MATCH (n)
      WITH n.christian_tradition AS christian_tradition, count(n) AS count
      WHERE n.christian_tradition IS NOT NULL
      RETURN DISTINCT {christian_tradition: christian_tradition, count: count} AS List
      `
    session.run(query).then((results) => {
      const christianTradition = results.records.map((record) => record.get('List', 'christian_tradition'));
      this.setState ({ christianTradition })
      session.close()})
  };

  //QUERY TO GET RELIGIOUS FAMILIES OF ALL NODES
  export function fetchReligiousFamily() {
    const session = this.driver.session();
    const query = `
      MATCH (n)
      WITH n.religious_family AS religious_family, count(n) AS count
      WHERE n.religious_family IS NOT NULL
      RETURN DISTINCT {religious_family: religious_family, count: count} AS List
      `
    session.run(query).then((results) => {
      const religiousFamilyList = results.records.map((record) => record.get('List', 'religious_family'));
      const religiousFamily = religiousFamilyList.filter(d => d.count >= 20)
      this.setState ({ religiousFamily })
      session.close()})
  };


  //QUERY TO GET CHRISTIAN TRADITIONS OF NULL VALUE
  export function fetchReligiousFamilyNullValues() {
    const session = this.driver.session();
    const query = `
      MATCH (n)
      WITH n.religious_family AS religious_family, count(n) AS count
      WHERE n.religious_family IS NULL
      RETURN count AS Count
      `
    session.run(query).then((results) => {
      const religiousFamilyNullValues = results.records.map((record) => record.get('Count', 'religious_family'));
      this.setState ({ religiousFamilyNullValues })
      session.close()})
  };

  //QUERY TO GET CHRISTIAN TRADITIONS OF NULL VALUE
  export function fetchChristianTraditionNullValues() {
    const session = this.driver.session();
    const query = `
      MATCH (n)
      WITH n.christian_tradition AS christian_tradition, count(n) AS count
      WHERE n.christian_tradition IS NULL
      RETURN count AS Count
      `
    session.run(query).then((results) => {
      const christianTraditionNullValues = results.records.map((record) => record.get('Count', 'christian_tradition'));
      this.setState ({ christianTraditionNullValues })
      session.close()})
  };

  //QUERY TO GET ALL THE CORPORATE ENTITIES
  export function fetchCorporateEntitiesWesternNames() {
    const session = this.driver.session();
    const query = `MATCH (n:CorporateEntity) RETURN n.name_western as List`
    session.run(query).then((results) => {
      const corporateEntitiesWesternNames = results.records.map((record) => record.get('List'));
      this.setState ({ corporateEntitiesWesternNames })
      session.close()})
  };

  export function fetchDataResults() {
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
        MATCH (n)-[t]-(o)`+ nodeIdFilter +`
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
                  (ulinks[i].start_year >= this.state.start_year && ulinks[i].end_year <= this.state.end_year && ulinks[i].start_year <= this.state.end_year)
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
