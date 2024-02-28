/////////////////////////////////////////////////////////////////////////////////////////////////////
// IMPORTS //////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

import { internal } from "neo4j-driver/lib/browser/neo4j-web";
import locations from "../../Assets/indexes/location-index.json"
import translate from "../../Assets/indexes/translate.json"

/////////////////////////////////////////////////////////////////////////////////////////////////////
// MAIN SEARCH & FILTER QUERIES /////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

// method to look up the neo4j id given the CHCD id
export function fetchNeo4jId(chcd_id, driver) {
  return new Promise((resolve, reject) => {
    const internalIdQuery = `MATCH (n) WHERE n.id = "${chcd_id}" RETURN ID(n) AS internalId LIMIT 1;`;
    // Execute the internal ID lookup query
    const session = driver.session();

    session.run(internalIdQuery)
      .then((result) => {
        session.close();

        if (result.records.length > 0) {
          resolve(result.records[0].get('internalId'));
        } else {
          resolve("init"); // Resolve with null or handle the case where no records are found
        }
      })
      .catch((error) => {
        session.close();
        console.error("Error executing query:", error);
        reject(error);
      });
  });
}

// QUERY TO FETCH RESULTS FOR SEARCH ////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
export function fetchSearch() {
  if (this.state.search !== "") {
    this.setState({ content: "loading" })
    const session = this.driver.session();
    const searchProp = this.state.search.replace(/[\(\)\[\]\{\}\.\\\/\-\_\^\~\`\|\^\*\^\"\"/'/']/g, " ");

    const query = `
  CALL db.index.fulltext.queryNodes("allPropIndex", "`+ searchProp + `~") YIELD node
  WITH node MATCH (node)-[t]-(m) 
  WHERE (node:Person OR node:Institution OR node:CorporateEntity OR node:Event OR node:Publication OR m:Person OR m:Institution OR m:CorporateEntity OR m:Event OR m:Publication) 
  AND NOT (m:GeneralArea OR m:Nation)
  RETURN DISTINCT {key:node.id, properties:properties(node), label:labels(node)[0], rel:t.rel_type, other:properties(m), start_year:t.start_year, end_year:t.end_year} as Nodes LIMIT 1000
  UNION
  MATCH (node)-[t]-(m) 
  WHERE (node:Person OR node:Institution OR node:CorporateEntity OR node:Event OR node:Publication OR m:Person OR m:Institution OR m:CorporateEntity OR m:Event OR m:Publication)
  AND NOT (node:GeneralArea OR node:Nation)
  AND (any(prop in keys(m) WHERE m[prop] =~ '(?i).*`+ searchProp + `.*'))
  RETURN DISTINCT {key:node.id, properties:properties(node), label:labels(node)[0], rel:t.rel_type, other_label:labels(m)[0], other:properties(m), start_year:t.start_year, end_year:t.end_year} as Nodes LIMIT 1000
    `
    session
      .run(query)
      .then((results) => {
        this.setState({ nodeArray: [], filterArray: [], genderList: [], nationalityList: [], labelList: [], relFamList: [], christTradList: [], instCatList: [], instSubCatList: [], corpCatList: [], corpSubCatList: [], eventCatList: [], eventSubCatList: [], pubCatList: [], pubSubCatList: [], affList: [] });
        this.setState({ label: "", nationality: "", gender: "", religious_family: "", christian_tradition: "", institution_category: "", institution_subcategory: "", corporate_entity_category: "", corporate_entity_subcategory: "", event_category: "", event_subcategory: "", name_western: "", inst_name_western: "" });

        const nodeArray = results.records.map((record) => record.get('Nodes'));
        if (nodeArray.length === 0) { this.setState({ noresults: "noresults" }); this.setState({ content: "loaded" }); this.setState({ searchSet: this.state.search }) }

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
          let pubCatList = [...new Set(nodeArray.map(item => item.properties.publication_category))];
          let pubSubCatList = [...new Set(nodeArray.map(item => item.properties.publication_subcategory))];
          let affList = [...new Set(nodeArray.map(item => { if (item.label === "Person") { return item.other.name_western } }))];
          let instList = [...new Set(nodeArray.map(item => { if (item.label === "Institution" && item.other.corporate_entity_category) { return item.other.name_western } }))];

          this.setState({ noResults: "no_results hide", content: "loaded" });
          this.setState({ nodeArray, filterArray });
          this.setState({ instList, affList, genderList, nationalityList, labelList, relFamList, christTradList, instCatList, instSubCatList, corpCatList, corpSubCatList, eventCatList, eventSubCatList, pubCatList, pubSubCatList });
          this.setState({ searchSet: this.state.search })
        }
        session.close()
      })
  } else { }
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
    this.state.end_year === "") {
    this.setState({ nosend: "nosend" })
  } else {
    this.setState({ append: this.state.append + 1 })
    this.setState({ content: "loading" })
    this.setState({ printArray: [], })
    const session = this.driver.session();

    //CONSTRUCT FILTERS FROM USER INPUT
    fetchNeo4jId(this.state.sent_id, this.driver)
      .then((internalId) => {
        let personNameFilter;
        if (this.state.family_name_western === "" && this.state.given_name_western === "") { personNameFilter = "" }
        else if (this.state.family_name_western !== "" && this.state.given_name_western === "") { personNameFilter = '(toLower(n.family_name_western)=~ "(?i)' + this.state.family_name_western.replace("(", "\\(").replace(")", "\\)").replace("[", "\\[").replace("]", "\\]").replace(".", "\\.") + '" OR toLower(n.family_name_western)=~ "(?i)' + this.state.family_name_western.replace("(", "\\(").replace(")", "\\)").replace("[", "\\[").replace("]", "\\]").replace(".", "\\.") + '.*")' }
        else if (this.state.family_name_western === "" && this.state.given_name_western !== "") { personNameFilter = '(toLower(n.given_name_western)=~ "(?i)' + this.state.given_name_western.replace("(", "\\(").replace(")", "\\)").replace("[", "\\[").replace("]", "\\]").replace(".", "\\.") + '" OR toLower(n.given_name_western)=~ "(?i)' + this.state.given_name_western.replace("(", "\\(").replace(")", "\\)").replace("[", "\\[").replace("]", "\\]").replace(".", "\\.") + '.*")' }
        else if (this.state.family_name_western !== "" && this.state.given_name_western !== "") { personNameFilter = '(toLower(n.family_name_western)=~ "(?i)' + this.state.family_name_western.replace("(", "\\(").replace(")", "\\)").replace("[", "\\[").replace("]", "\\]").replace(".", "\\.") + '" OR toLower(n.family_name_western)=~ "(?i)' + this.state.family_name_western.replace("(", "\\(").replace(")", "\\)").replace("[", "\\[").replace("]", "\\]").replace(".", "\\.") + '.*") AND (toLower(n.given_name_western)=~ "(?i)' + this.state.given_name_western.replace("(", "\\(").replace(")", "\\)").replace("[", "\\[").replace("]", "\\]").replace(".", "\\.") + '" OR toLower(n.given_name_western)=~ "(?i)' + this.state.given_name_western.replace("(", "\\(").replace(")", "\\)").replace("[", "\\[").replace("]", "\\]").replace(".", "\\.") + '.*")' }

        let personNameFilter2;
        if (this.state.sent_id !== "init" && this.state.kind === "People") { personNameFilter2 = " AND " + personNameFilter }
        else if (this.state.start_year !== "" | this.state.end_year !== "" && personNameFilter !== "") { personNameFilter2 = " AND " + personNameFilter }
        else if (personNameFilter === "") { personNameFilter2 = "" }
        else { personNameFilter2 = " WHERE " + personNameFilter }

        let nameFilter2;
        if (this.state.name_western !== "") { nameFilter2 = 'AND (toLower(r.name_western)= "(?i)' + this.state.name_western.replace("(", "\\(").replace(")", "\\)").replace("[", "\\[").replace("]", "\\]").replace(".", "\\.") + '" OR toLower(r.name_western)=~ "(?i)' + this.state.name_western.replace("(", "\\(").replace(")", "\\)").replace("[", "\\[").replace("]", "\\]").replace(".", "\\.") + '.*")' }
        else { nameFilter2 = "" };

        let icatFilter; if (this.state.institution_category === "All") { icatFilter = "" } else if (this.state.institution_category !== "All" || this.state.institution_category !== "") { icatFilter = 'institution_category: "' + this.state.institution_category + '"' } else { icatFilter = "" };

        let isubcatFilter; if (this.state.institution_subcategory === "All") { isubcatFilter = "" } else if (this.state.institution_subcategory !== "All" || this.state.institution_subcategory !== "") { isubcatFilter = 'institution_subcategory: "' + this.state.institution_subcategory + '"' } else { isubcatFilter = "" };

        let genderFilter; if (this.state.gender !== "All") { genderFilter = 'gender: "' + this.state.gender + '"' } else { genderFilter = "" };

        let nationalityFilter; if (this.state.nationality === "All") { nationalityFilter = "" } else if (this.state.nationality !== "") { nationalityFilter = 'nationality: "' + this.state.nationality + '"' } else { nationalityFilter = "" };

        let affFilter; if (this.state.affiliation === "All") { affFilter = "" } else if (this.state.affiliation !== "All" || this.state.affiliation !== "") { affFilter = 'name_western: "' + this.state.affiliation + '"' } else { affFilter = "" };
        let relFamFilter; if (this.state.religious_family !== "All") { relFamFilter = 'religious_family: "' + this.state.religious_family + '"' } else { relFamFilter = "" };

        let locatArray = [];
        for (let i = 0; i < locations.length; i++) {
          if (locations[i].name_zh === this.state.location) {
            locatArray = '"' + locations[i].contains.join('", "') + '"'
          }
        }

        let locatFilter;
        if (locatArray.length >= 1) { locatFilter = ' AND l.id IN [' + locatArray + ']' }
        else { locatFilter = " " }


        let timeFilter;
        if (this.state.start_year !== "" && this.state.end_year !== "") { 
          timeFilter = ` WHERE ((t.start_year IS NOT NULL) AND (t.start_year >= ${this.state.start_year}) AND (t.start_year <= ${this.state.end_year})) OR
          ((t.end_year IS NOT NULL) AND (t.end_year >= ${this.state.start_year}) AND (t.end_year <= ${this.state.end_year})) OR
          ((t.start_year IS NOT NULL) AND (t.start_year < ${this.state.start_year}) AND (t.end_year IS NOT NULL) AND (t.end_year > ${this.state.end_year}))`
        }
        else if (this.state.start_year === "" && this.state.end_year !== "") { 
          timeFilter = ` WHERE (t.start_year <= ${this.state.end_year}) OR (t.end_year <= ${this.state.end_year})` 
        }
        else if (this.state.start_year !== "" && this.state.end_year === "") { 
          timeFilter = ` WHERE (t.start_year >= ${this.state.start_year}) OR (t.end_year >= ${this.state.start_year})`
        } 
        
        
        else { timeFilter = "" };
        let timeFilter_t2;
        timeFilter_t2 = timeFilter.replace(/t\./g, 't[0].'); // Adjust the timeFilter for t*2

        let keyFilter;
        if (this.state.sent_id !== "init" && this.state.kind === "People") {
          if (timeFilter !== "") { keyFilter = ' AND ID(n)=' + internalId }
          else { keyFilter = ' WHERE ID(n)=' + internalId }
        }
        else if (this.state.sent_id !== "init" && this.state.kind === "Institutions" && this.state.affiliation === "All") {
          if (timeFilter !== "") { keyFilter = ' AND ID(r)=' + internalId }
          else { keyFilter = ' WHERE ID(r)=' + internalId }
        }
        else { keyFilter = "" }

        //CONCAT & CLEAN FILTERS
        const filterStatic = [genderFilter, nationalityFilter]
        const filterStaticClean = filterStatic.filter(value => value.length > 1).join();

        const corpFilterStatic = [relFamFilter, affFilter]
        const corpFilterStaticClean = corpFilterStatic.filter(value => value.length > 1).join();
        const instFilterStatic = [icatFilter, isubcatFilter]
        const instFilterStaticClean = instFilterStatic.filter(value => value.length > 1).join();

        let unAffFilter;
        if (this.state.sent_id !== "init" && this.state.kind === "People" && this.state.affiliation === "All") {
          unAffFilter = `UNION MATCH (n:Person {` + filterStaticClean + `})-[t]-(r:Institution)` + timeFilter + keyFilter + personNameFilter2 + `
      WITH n,r,t
      MATCH (r)-[]->(l) WHERE (l:Township OR l:Village OR l:County OR l:Prefecture OR l:Province) `+ locatFilter + `
      RETURN {key:n.id,
        properties:properties(n),inst:properties(r),aff:properties(r),locat:properties(l),rel:properties(t),locat_name:properties(l).name_wes} AS Nodes`
        }
        else { unAffFilter = "" }

        //CONSTRUCT QUERY WITH VARIABLES
        let query;
        if (this.state.kind === "People") {
          const query = `
          MATCH (n:Person {`+ filterStaticClean + `})-[t]-(r)-[]-(e:CorporateEntity {` + affFilter + `})` + timeFilter + keyFilter + personNameFilter2 + `
          WITH n,r,e,t
          MATCH (r)-[]->(l) WHERE (l:Township OR l:Village OR l:County OR l:Prefecture OR l:Province)`+ locatFilter + `
          RETURN {key:n.id,properties:properties(n),inst:properties(r),aff:properties(e),locat:properties(l),rel:properties(t),locat_name:properties(l).name_wes} AS Nodes
          `+ unAffFilter + `
          UNION MATCH (e:CorporateEntity {`+ affFilter + `})-[]-(n:Person {` + filterStaticClean + `})-[t]-(r)` + timeFilter + keyFilter + personNameFilter2 + `
          WITH n,r,e,t
          MATCH (r)-[]->(l) WHERE (l:Township OR l:Village OR l:County OR l:Prefecture OR l:Province)`+ locatFilter + `
          RETURN {key:n.id,properties:properties(n),inst:properties(r),aff:properties(e),locat:properties(l),rel:properties(t),locat_name:properties(l).name_wes} AS Nodes
          `
          session
            .run(query)
            .then((results) => {
              let unfiltArray = results.records.map((record) => record.get('Nodes'));
              let nodeArray = unfiltArray.filter(node => node.locat.latitude && node.locat.longitude);
              if (nodeArray.length === 0) {
                this.setState({ noresults: "noresults" });
                this.setState({ content: "loaded" });
              }
              else {
                const mapBounds = nodeArray.map(node => ([node.locat.latitude, node.locat.longitude]));
                this.setState({ nodeArray })
                this.setState({ mapBounds });
                this.setState({ noresults: "noresults hide" });
                this.setState({ content: "loaded" });
                this.setState({ sent_id: "init" });
                session.close()
              }
            })

          const session2 = this.driver.session()
          const query2 = `
            CALL {
            MATCH (n:Person {${filterStaticClean}})-[t]-(r:Institution)-[]-(e:CorporateEntity {${affFilter}}) ${timeFilter} ${keyFilter} ${personNameFilter2}
            WITH n,r,e,t
            MATCH (r)-[]->(l) WHERE (l:Township OR l:Village OR l:County OR l:Prefecture OR l:Province) ${locatFilter}
            RETURN {
              person_id:n.id, 
              person_name_western: CASE WHEN n.name_western IS NOT NULL THEN n.name_western ELSE n.given_name_western + ' ' + toUpper(n.family_name_western) END,
              person_name_chinese: CASE WHEN n.chinese_name_hanzi IS NOT NULL THEN n.chinese_name_hanzi ELSE n.chinese_family_name_hanzi + '' + n.chinese_given_name_hanzi END, 
              inst_id:r.id,
              inst_name_western: CASE WHEN r.name_western IS NOT NULL THEN r.name_western ELSE r.given_name_western + ' ' + toUpper(r.family_name_western) END, 
              inst_name_chinese: CASE WHEN r.chinese_name_hanzi IS NOT NULL THEN r.chinese_name_hanzi ELSE r.chinese_family_name_hanzi + '' + r.chinese_given_name_hanzi END, 
              location_name_western: l.name_wes,
              location_name_chinese: l.name_zh,
              longitude: l.longitude,
              latitude: l.latitude,
              rel_type: t.rel_type, 
              start_year: CASE WHEN toInteger(t.start_year) > 0 THEN toInteger(t.start_year) ELSE "" END, 
              end_year: CASE WHEN toInteger(t.end_year) > 0 THEN toInteger(t.end_year) ELSE "" END, 
              sources: COALESCE(t.source ,"")+ CASE WHEN r.source IS NOT NULL THEN ' / ' ELSE '' END + COALESCE(r.source ,""), 
              notes: COALESCE(t.notes ,"") + CASE WHEN r.notes IS NOT NULL THEN ' / ' ELSE '' END + COALESCE(r.notes ,"")} AS Nodes
            ${unAffFilter}
            UNION MATCH (e:CorporateEntity {${affFilter}})-[]-(n:Person {${filterStaticClean}})-[t]-(r:Institution) ${timeFilter} ${keyFilter} ${personNameFilter2}
            WITH n,r,e,t
            MATCH (r)-[]->(l) WHERE (l:Township OR l:Village OR l:County OR l:Prefecture OR l:Province)`+ locatFilter + `
            RETURN {
              key: n.id,
              person_id:n.id, 
              person_name_western: CASE WHEN n.name_western IS NOT NULL THEN n.name_western ELSE n.given_name_western + ' ' + toUpper(n.family_name_western) END,
              person_name_chinese: CASE WHEN n.chinese_name_hanzi IS NOT NULL THEN n.chinese_name_hanzi ELSE n.chinese_family_name_hanzi + '' + n.chinese_given_name_hanzi END, 
              inst_id:r.id,
              inst_name_western: CASE WHEN r.name_western IS NOT NULL THEN r.name_western ELSE r.given_name_western + ' ' + toUpper(r.family_name_western) END, 
              inst_name_chinese: CASE WHEN r.chinese_name_hanzi IS NOT NULL THEN r.chinese_name_hanzi ELSE r.chinese_family_name_hanzi + '' + r.chinese_given_name_hanzi END, 
              location_name_western: l.name_wes,
              location_name_chinese: l.name_zh,
              longitude: l.longitude,
              latitude: l.latitude,
              rel_type: t.rel_type, 
              start_year: CASE WHEN toInteger(t.start_year) > 0 THEN toInteger(t.start_year) ELSE "" END, 
              end_year: CASE WHEN toInteger(t.end_year) > 0 THEN toInteger(t.end_year) ELSE "" END, 
              sources: COALESCE(t.source ,"")+ CASE WHEN r.source IS NOT NULL THEN ' / ' ELSE '' END + COALESCE(r.source ,""), 
              notes: COALESCE(t.notes ,"") + CASE WHEN r.notes IS NOT NULL THEN ' / ' ELSE '' END + COALESCE(r.notes ,"")} AS Nodes
            }
            RETURN DISTINCT Nodes
            `
          session2
            .run(query2)
            .then((results) => {
              let unfiltArrayPrint = results.records.map((record) => record.get('Nodes'));
              let printArray = unfiltArrayPrint.filter(i => i.latitude && i.longitude);
              this.setState({ printArray })
              session2.close()
            })

        } else if (this.state.kind === "Institutions") {
          const query = `
      MATCH (r:Institution {` + instFilterStaticClean + `})-[t]-(e:CorporateEntity {` + corpFilterStaticClean + `})` + timeFilter + keyFilter + `
      WITH t, r, e
      MATCH (r)-[]->(l)
      WHERE (l:Township OR l:Village OR l:County OR l:Prefecture OR l:Province)` + locatFilter + nameFilter2 + `
      RETURN {
        key: r.id,
        properties: properties(r),
        aff: properties(e),
        locat: properties(l),
        rel: properties(t),
        locat_name: properties(l).name_wes
      } AS Nodes
      UNION
      MATCH (r:Institution {` + instFilterStaticClean + `})-[t*2]-(e:CorporateEntity {` + corpFilterStaticClean + `})` + timeFilter_t2 + keyFilter + `
      WITH t, r, e
      MATCH (r)-[]->(l)
      WHERE (l:Township OR l:Village OR l:County OR l:Prefecture OR l:Province)` + locatFilter + nameFilter2 + `
      RETURN {
        key: r.id,
        properties: properties(r),
        aff: properties(e),
        locat: properties(l),
        rel: properties(t[1]),
        locat_name: properties(l).name_wes
      } AS Nodes
      `
          session.run(query).then((results) => {
            let unfiltArray = results.records.map((record) => record.get('Nodes'));
            let nodeArray;
            if (this.state.location !== "All" && this.state.location !== "都") { nodeArray = unfiltArray.filter(e => locatFilter[0].includes(e.locat.name_zh)).filter(node => node.locat.latitude && node.locat.longitude) }
            else { nodeArray = unfiltArray.filter(node => node.locat.latitude && node.locat.longitude) };
            if (nodeArray.length === 0) {
              this.setState({ noresults: "noresults" });
              this.setState({ content: "loaded" });
            }
            else {
              const mapBounds = nodeArray.map(node => ([node.locat.latitude, node.locat.longitude]));
              this.setState({ nodeArray });
              this.setState({ mapBounds });
              this.setState({ noresults: "noresults hide" });
              this.setState({ content: "loaded" });
              this.setState({ sent_id: "init" });
            }
            session.close()
          })

          const session2 = this.driver.session()
          const query2 = `
            CALL {
              MATCH (r:Institution {`+ instFilterStaticClean + `})-[t]-(e:CorporateEntity {` + corpFilterStaticClean + `})` + timeFilter + keyFilter + `
              WITH t,r,e MATCH (r)-[]->(l) WHERE (l:Township OR l:Village OR l:County OR l:Prefecture OR l:Province)`+ locatFilter + nameFilter2 + `
              RETURN {
                key: r.id,
                inst_id:r.id,
                inst_name_western: r.name_western,
                inst_name_chinese: r.chinese_name_hanzi,
                corp_id:e.id,
                corp_name_western: e.name_western,
                corp_name_chinese: e.chinese_name_hanzi,
                location_name_western: l.name_wes,
                location_name_chinese: l.name_zh,
                longitude: l.longitude,
                latitude: l.latitude,
                rel_type: t.rel_type, 
                start_year: CASE WHEN toInteger(t.start_year) > 0 THEN toInteger(t.start_year) ELSE "" END, 
                end_year: CASE WHEN toInteger(t.end_year) > 0 THEN toInteger(t.end_year) ELSE "" END, 
                sources: COALESCE(t.source ,"")+ CASE WHEN r.source IS NOT NULL THEN ' / ' ELSE '' END + COALESCE(r.source ,""), 
                notes: COALESCE(t.notes ,"") + CASE WHEN r.notes IS NOT NULL THEN ' / ' ELSE '' END + COALESCE(r.notes ,"")
              } AS Nodes
              UNION MATCH (r:Institution {`+ instFilterStaticClean + `})-[t*2]-(e:CorporateEntity {` + corpFilterStaticClean + `})` + timeFilter_t2 + keyFilter + `
              WITH t,r,e MATCH (r)-[]->(l) WHERE (l:Township OR l:Village OR l:County OR l:Prefecture OR l:Province)`+ locatFilter + nameFilter2 + `
              RETURN {
                key: r.id,
                inst_id:r.id,
                inst_name_western: r.name_western,
                inst_name_chinese: r.chinese_name_hanzi,
                corp_id:e.id,
                corp_name_western: e.name_western,
                corp_name_chinese: e.chinese_name_hanzi,
                location_name_western: l.name_wes,
                location_name_chinese: l.name_zh,
                longitude: l.longitude,
                latitude: l.latitude,
                rel_type: t[1].rel_type, 
                start_year: CASE WHEN toInteger(t[1].start_year) > 0 THEN toInteger(t[1].start_year) ELSE "" END, 
                end_year: CASE WHEN toInteger(t[1].end_year) > 0 THEN toInteger(t[1].end_year) ELSE "" END, 
                sources: COALESCE(t[1].source ,"")+ CASE WHEN r.source IS NOT NULL THEN ' / ' ELSE '' END + COALESCE(r.source ,""), 
                notes: COALESCE(t[1].notes ,"") + CASE WHEN r.notes IS NOT NULL THEN ' / ' ELSE '' END + COALESCE(r.notes ,"")
              } AS Nodes
            }
            RETURN DISTINCT Nodes
            `
          session2
            .run(query2)
            .then((results) => {
              let unfiltArrayPrint = results.records.map((record) => record.get('Nodes'));
              let printArray = unfiltArrayPrint.filter(i => i.latitude && i.longitude);
              this.setState({ printArray })
              session2.close()
            })


        } else if (this.state.kind === "Events") {
          const query = `
          MATCH (r:Event {`+ instFilterStaticClean + `})-[t]-(l)` + timeFilter + keyFilter + `
          WITH r,t,l MATCH (r)-[t]->(l) WHERE (l:Township OR l:Village OR l:County OR l:Prefecture OR l:Province)`+ locatFilter + nameFilter2 + `
          RETURN {key: r.id,
          properties:properties(r),locat:properties(l),rel:properties(t),locat_name:properties(l).name_wes} AS Nodes
          `
          session.run(query).then((results) => {
            let unfiltArray = results.records.map((record) => record.get('Nodes'));
            let nodeArray = unfiltArray.filter(node => node.locat.latitude && node.locat.longitude);
            if (nodeArray.length === 0) {
              this.setState({ noresults: "noresults" });
              this.setState({ content: "loaded" });
            }
            else {
              const mapBounds = nodeArray.map(node => ([node.locat.latitude, node.locat.longitude]));
              this.setState({ nodeArray });
              this.setState({ mapBounds });
              this.setState({ noresults: "noresults hide" });
              this.setState({ content: "loaded" });
              this.setState({ sent_id: "init" });
            }
            session.close()
          })

          const session2 = this.driver.session()
          const query2 = `
            MATCH (r:Event {`+ instFilterStaticClean + `})-[t]-(l)` + timeFilter + keyFilter + `
            WITH r,t,l MATCH (r)-[t]->(l) WHERE (l:Township OR l:Village OR l:County OR l:Prefecture OR l:Province)`+ locatFilter + nameFilter2 + `
            RETURN {
              key: r.id,
              event_id:r.id,
              event_name_western: r.name_western,
              event_name_chinese: r.chinese_name_hanzi,
              location_name_western: l.name_wes,
              location_name_chinese: l.name_zh,
              longitude: l.longitude,
              latitude: l.latitude,
              rel_type: t.rel_type, 
              start_year: CASE WHEN toInteger(t.start_year) > 0 THEN toInteger(t.start_year) ELSE "" END, 
              end_year: CASE WHEN toInteger(t.end_year) > 0 THEN toInteger(t.end_year) ELSE "" END, 
              sources: COALESCE(t.source ,"")+ CASE WHEN r.source IS NOT NULL THEN ' / ' ELSE '' END + COALESCE(r.source ,""), 
              notes: COALESCE(t.notes ,"") + CASE WHEN r.notes IS NOT NULL THEN ' / ' ELSE '' END + COALESCE(r.notes ,"")
            } AS Nodes
            `
          session2
            .run(query2)
            .then((results) => {
              let unfiltArrayPrint = results.records.map((record) => record.get('Nodes'));
              let printArray = unfiltArrayPrint.filter(i => i.latitude && i.longitude);
              this.setState({ printArray })
              session2.close()
            })

        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
};


//QUERIES FOR NETWORK GRAPH  ////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

//QUERY FOR NETWORK GRAPH TIME CONFINES
export function fetchNetworkConfines() {
  if (this.state.node_id === "" && this.state.nodeSelect === "") { return null }
  else {
    let nodeIdFilter;
    fetchNeo4jId(this.state.node_id, this.driver)
      .then((internalId) => {
        if (this.state.node_id !== "") {
          nodeIdFilter = 'WHERE id(n) =' + parseFloat(internalId) + ' '
        } else { nodeIdFilter = "" };
        const session = this.driver.session();
        const query = `
        MATCH (n)-[t]-(o)`+ nodeIdFilter + `
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
          if (this.state.start_year === "") { start = networkConfines[0].start } else { start = this.state.start_year }
          if (this.state.end_year === "") { end = networkConfines[0].end } else { end = this.state.end_year }
          this.setState({ start_year: start })
          this.setState({ end_year: end })
          this.setState({ time_disable: false })
          session.close()
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
};

//QUERY FOR NETWORK GRAPH RESULTS
export function fetchNetworkResults() {
  if (this.state.node_id === "" && this.state.nodeSelect === "") {
    this.setState({ nosend: "nosend" })
  }
  else {
    this.setState({ content: "loading" });
    this.setState({ nodeArray: [] });
    this.setState({ printArray: [] });
    this.setState({ append: this.state.append + 1 });

    //SET CENTRAL NODE
    let nodeIdFilter;
    fetchNeo4jId(this.state.node_id, this.driver)
      .then((internalId) => {
        if (this.state.node_id !== "") {
          nodeIdFilter = '' + parseFloat(internalId) + ' '
        } else { nodeIdFilter = "" };

        //SET NETWORK CONFINES
        let start;
        let end;

        const session1 = this.driver.session();
        const query2 = `
          MATCH (n)-[t]-(o) WHERE id(n)=`+ nodeIdFilter + `
          WITH collect(n.birth_year)+collect(n.death_year)+collect(DISTINCT t.start_year)+collect(DISTINCT t.end_year) as list
          UNWIND list as years
          WITH years ORDER BY years
          WITH (head(collect(distinct years))) as head, (last(collect(distinct years))) as last
          RETURN {start:head, end:last} as Confines
          `
        session1.run(query2).then((results) => {
          const networkConfines = results.records.map((record) => record.get('Confines'));
          if (this.state.start_year === "") { start = networkConfines[0].start } else { start = this.state.start_year }
          if (this.state.end_year === "") { end = networkConfines[0].end } else { end = this.state.end_year }
          this.setState({ start_year: start })
          this.setState({ end_year: end })
          this.setState({ time_disable: false })
          session1.close()
        });

        //CONSTRUCT FILTERS FROM USER INPUT
        let degreeFilter; if (this.state.degree !== 1) { degreeFilter = this.state.degree } else { degreeFilter = 1 };
        let peopleFilter; if (this.state.people_include === true) { peopleFilter = "+" } else { peopleFilter = "-" }
        let instFilter; if (this.state.inst_include === true) { instFilter = "+" } else { instFilter = "-" }
        let corpFilter; if (this.state.corp_include === true) { corpFilter = "+" } else { corpFilter = "-" }
        let eventFilter; if (this.state.event_include === true) { eventFilter = "+" } else { eventFilter = "-" }
        let pubFilter; if (this.state.pub_include === true) { pubFilter = "+" } else { pubFilter = "-" }
        //CONCAT FILTERS
        const filterStatic = [nodeIdFilter]
        const filterStaticClean = filterStatic.filter(value => value.length > 1).join();

        //CONSTRUCT QUERY WITH VARIABLES
        const session = this.driver.session();

        let startFilter = null;
        let endFilter = null;
        if (this.state.end_year !== "") { endFilter = this.state.end_year }
        if (this.state.start_year !== "") { startFilter = this.state.start_year }

        const query = `MATCH (n)-[t]-(o)
          WHERE id(n) = ` + nodeIdFilter + `
          WITH DISTINCT n, t, o
          CALL apoc.path.subgraphAll(n, {
            maxLevel: `+ degreeFilter + `,
            labelFilter: "` + peopleFilter + `Person|` + instFilter + `Institution|` + corpFilter + `CorporateEntity|` + eventFilter + `Event|` + pubFilter + `Publication|-Village|-Township|-County|-Prefecture|-Province"
          })
          YIELD nodes, relationships
          WITH nodes, relationships
          UNWIND nodes AS ender
          MATCH (ender:Person)-[p]-(q)
          WHERE ( 
            (${endFilter} IS NOT NULL AND p.start_year >= ${endFilter}) OR
            (${startFilter} IS NOT NULL AND p.end_year <= ${startFilter})
          )
          WITH collect(DISTINCT ender) AS endNodes
          MATCH (y)
          WHERE id(y) = `+ nodeIdFilter + `
          CALL apoc.path.subgraphAll(y, {
            maxLevel: `+ degreeFilter + `,
            labelFilter: "` + peopleFilter + `Person|` + instFilter + `Institution|` + corpFilter + `CorporateEntity|` + eventFilter + `Event|` + pubFilter + `Publication|-Village|-Township|-County|-Prefecture|-Province",
            blacklistNodes: endNodes
          })
          YIELD nodes, relationships
          WITH nodes, relationships
          RETURN {
            nodes: [node in nodes | node {key: node.id, label: labels(node)[0], properties: properties(node)}],
            links: [rel in relationships | rel {source: startNode(rel).id, target: endNode(rel).id, start_year: rel.start_year, end_year: rel.end_year}]
          } as Graph`

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
                  (ulinks[i].start_year <= this.state.end_year || ulinks[i].end_year <= this.state.end_year || ulinks[i].end_year === null)
                ) || (
                  (this.state.start_year !== "" && this.state.end_year === "") &&
                  (ulinks[i].start_year >= this.state.state_year || ulinks[i].end_year >= this.state.start_year || ulinks[i].start_year === null)
                ) || (
                  (this.state.start_year === "" && this.state.end_year === "")
                )
              ) { links.push(ulinks[i]) }
            }
            const nodeArray = [{ nodes: newArray[0].nodes, links: links, }]
            if (nodeArray.length === 0) { this.setState({ noresults: "noresults" }) }
            else {
              this.setState({ nodeArray });
              this.setState({ noresults: "noresults hide" })
              this.setState({ content: "loaded" })
            }
            session.close()
          });
      })
      .catch((error) => {
        console.error("Error:", error);
      });

  }
};


/////////////////////////////////////////////////////////////////////////////////////////////////////
// QUERIES FOR POPUP INFORMATION ////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

//QUERY FOR SELECTED NODE + APPEND BREADCRUMB (CLICK IN POPUP CONTENT)
export function selectSwitchAppend(event) {
  this.setState({ nodeSelect: event });
  fetchNeo4jId(event, this.driver)
    .then((internalId) => {
      const session = this.driver.session()
      const selectquery = `
        MATCH (n)-[t]-(p:Person)
        WHERE ID(n) = ${internalId}
        RETURN {
            key: n.id,
            select_kind: labels(n)[0],
            select_node: properties(n),
            key2: p.id,
            node2: properties(p),
            rel_kind: labels(p)[0],
            rel: properties(t),
            rel_locat: "none"
        } AS SelectNodes
        ORDER BY SelectNodes.rel.start_year

        UNION

        MATCH (n)-[t]-(p:Publication)
        WHERE ID(n) = ${internalId}
        RETURN {
            key: n.id,
            select_kind: labels(n)[0],
            select_node: properties(n),
            key2: p.id,
            node2: properties(p),
            rel_kind: labels(p)[0],
            rel: properties(t),
            rel_locat: "none"
        } AS SelectNodes
        ORDER BY SelectNodes.rel.start_year

        UNION

        MATCH (n)-[t]-(p:CorporateEntity)
        WHERE ID(n) = ${internalId}
        RETURN {
            key: n.id,
            select_kind: labels(n)[0],
            select_node: properties(n),
            key2: p.id,
            node2: properties(p),
            rel_kind: labels(p)[0],
            rel: properties(t),
            rel_locat: "none"
        } AS SelectNodes
        ORDER BY SelectNodes.rel.start_year

        UNION

        MATCH (n)-[t]-(p:Event)
        WHERE ID(n) = ${internalId}
        RETURN {
            key: n.id,
            select_kind: labels(n)[0],
            select_node: properties(n),
            key2: p.id,
            node2: properties(p),
            rel_kind: labels(p)[0],
            rel: properties(t),
            rel_locat: "none"
        } AS SelectNodes
        ORDER BY SelectNodes.rel.start_year

        UNION

        MATCH (n)-[t]-(p:Institution)
        WHERE ID(n) = ${internalId}
        RETURN {
            key: n.id,
            select_kind: labels(n)[0],
            select_node: properties(n),
            key2: p.id,
            node2: properties(p),
            rel_kind: labels(p)[0],
            rel: properties(t),
            rel_locat: "none"
        } AS SelectNodes
        ORDER BY SelectNodes.rel.start_year

        UNION

        MATCH (n)-[t]-(p:Geography)
        WHERE ID(n) = ${internalId}
        RETURN {
            key: n.id,
            select_kind: labels(n)[0],
            select_node: properties(n),
            key2: p.id,
            node2: properties(p),
            rel_kind: "Geography",
            rel: properties(t),
            rel_locat: t.notes
        } AS SelectNodes
        ORDER BY SelectNodes.rel.start_year IS NULL
        `;

      session.run(selectquery).then((results) => {
        const selectArray = results.records.map((record) => record.get('SelectNodes')); this.setState({ selectArray });
        this.breadCrumbChainer();
        session.close()
      });

      const session2 = this.driver.session()
      const selectquery2 = `
    MATCH (n)-[t]-(p) WHERE ID(n) =` + internalId + `
    RETURN {start_id:n.id, 
      start_name_western: CASE WHEN n.name_western IS NOT NULL THEN n.name_western ELSE n.given_name_western + ' ' + toUpper(n.family_name_western) END,
      start_name_chinese: CASE WHEN n.chinese_name_hanzi IS NOT NULL THEN n.chinese_name_hanzi ELSE n.chinese_family_name_hanzi + '' + n.chinese_given_name_hanzi END,
      start_type: labels(n)[0], 
      end_id:p.id,
      end_name_western: CASE WHEN p.name_western IS NOT NULL THEN p.name_western ELSE p.given_name_western + ' ' + toUpper(p.family_name_western) END, 
      end_name_chinese: CASE WHEN p.chinese_name_hanzi IS NOT NULL THEN p.chinese_name_hanzi ELSE p.chinese_family_name_hanzi + '' + p.chinese_given_name_hanzi END, 
      end_type: CASE WHEN size(labels(p)) = 1 THEN labels(p)[0] ELSE "Geography" END,  // Check the number of labels for p
      rel_kind: type(t), rel_type: t.rel_type, start_year: CASE WHEN toInteger(t.start_year) > 0 THEN toInteger(t.start_year) ELSE "" END, 
      end_year: CASE WHEN toInteger(t.end_year) > 0 THEN toInteger(t.end_year) ELSE "" END, 
      sources: COALESCE(t.source ,"")+ CASE WHEN p.source IS NOT NULL THEN ' / ' ELSE '' END + COALESCE(p.source ,""), 
    notes: COALESCE(t.notes ,"") + CASE WHEN p.notes IS NOT NULL THEN ' / ' ELSE '' END + COALESCE(p.notes ,"")
    } as SelectNodes `
      session2.run(selectquery2).then((results) => {
        const printArray = results.records.map((record) => record.get('SelectNodes'));
        this.setState({ printArray });
        session2.close()
      });

      const session3 = this.driver.session()
      const selectquery3 = `MATCH (n) WHERE ID(n) =` + internalId + ` RETURN n{.*} as SelectNodes `
      session3.run(selectquery3).then((results) => {
        const basicArray = results.records.map((record) => record.get('SelectNodes'));
        this.setState({ basicArray });
        session3.close()
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

//QUERY FOR SELECTED NODE + REDUCE BREADCRUMB (CLICK IN POPUP CONTENT)
export function selectSwitchReduce(event, order) {
  this.setState({ nodeSelect: event });
  fetchNeo4jId(event, this.driver)
    .then((internalId) => {
      const session = this.driver.session()
      const selectquery = `
        MATCH (n)-[t]-(p:Person)
        WHERE ID(n) = ${internalId}
        RETURN {
            key: n.id, 
            select_kind: labels(n)[0],
            select_node: properties(n),
            key2: p.id,
            node2: properties(p),
            rel_kind: labels(p)[0],
            rel: properties(t),
            rel_locat: "none"
        } AS SelectNodes
        ORDER BY SelectNodes.rel.start_year

        UNION

        MATCH (n)-[t]-(p:Publication)
        WHERE ID(n) = ${internalId}
        RETURN {
            key: n.id,
            select_kind: labels(n)[0],
            select_node: properties(n),
            key2: p.id,
            node2: properties(p),
            rel_kind: labels(p)[0],
            rel: properties(t),
            rel_locat: "none"
        } AS SelectNodes
        ORDER BY SelectNodes.rel.start_year

        UNION

        MATCH (n)-[t]-(p:CorporateEntity)
        WHERE ID(n) = ${internalId}
        RETURN {
            key: n.id,
            select_kind: labels(n)[0],
            select_node: properties(n),
            key2: p.id,
            node2: properties(p),
            rel_kind: labels(p)[0],
            rel: properties(t),
            rel_locat: "none"
        } AS SelectNodes
        ORDER BY SelectNodes.rel.start_year

        UNION

        MATCH (n)-[t]-(p:Event)
        WHERE ID(n) = ${internalId}
        RETURN {
            key: n.id,
            select_kind: labels(n)[0],
            select_node: properties(n),
            key2: p.id,
            node2: properties(p),
            rel_kind: labels(p)[0],
            rel: properties(t),
            rel_locat: "none"
        } AS SelectNodes
        ORDER BY SelectNodes.rel.start_year

        UNION

        MATCH (n)-[t]-(p:Institution)
        WHERE ID(n) = ${internalId}
        RETURN {
            key: n.id,
            select_kind: labels(n)[0],
            select_node: properties(n),
            key2: p.id,
            node2: properties(p),
            rel_kind: labels(p)[0],
            rel: properties(t),
            rel_locat: "none"
        } AS SelectNodes
        ORDER BY SelectNodes.rel.start_year

        UNION

        MATCH (n)-[t]-(p:Geography)
        WHERE ID(n) = ${internalId}

        RETURN {
            key: n.id,
            select_kind: labels(n)[0],
            select_node: properties(n),
            key2: p.id,
            node2: properties(p),
            rel_kind: "Geography",
            rel: properties(t),
            rel_locat: t.notes
        } AS SelectNodes
        ORDER BY SelectNodes.rel.start_year IS NULL
        `;
      session.run(selectquery).then((results) => {
        const selectArray = results.records.map((record) => record.get('SelectNodes')); this.setState({ selectArray });
        this.breadCrumbReducer(event, order);
        session.close()
      });

      const session2 = this.driver.session()
      const selectquery2 = `
        MATCH (n)-[t]-(p) WHERE ID(n) = ${internalId}
        RETURN {
          start_id:n.id, 
          start_name_western: CASE WHEN n.name_western IS NOT NULL THEN n.name_western ELSE n.given_name_western + ' ' + toUpper(n.family_name_western) END,
          start_name_chinese: CASE WHEN n.chinese_name_hanzi IS NOT NULL THEN n.chinese_name_hanzi ELSE n.chinese_family_name_hanzi + '' + n.chinese_given_name_hanzi END,
          start_type: labels(n)[0], 
          end_id:p.id,
          end_name_western: CASE WHEN p.name_western IS NOT NULL THEN p.name_western ELSE p.given_name_western + ' ' + toUpper(p.family_name_western) END, 
          end_name_chinese: CASE WHEN p.chinese_name_hanzi IS NOT NULL THEN p.chinese_name_hanzi ELSE p.chinese_family_name_hanzi + '' + p.chinese_given_name_hanzi END, 
          end_type: CASE WHEN size(labels(p)) = 1 THEN labels(p)[0] ELSE "Geography" END,  // Check the number of labels for p
          rel_kind: type(t), 
          rel_type: t.rel_type, 
          start_year: CASE WHEN toInteger(t.start_year) > 0 THEN toInteger(t.start_year) ELSE "" END, 
          end_year: CASE WHEN toInteger(t.end_year) > 0 THEN toInteger(t.end_year) ELSE "" END, 
          sources: COALESCE(t.source ,"")+ CASE WHEN p.source IS NOT NULL THEN ' / ' ELSE '' END + COALESCE(p.source ,""), 
          notes: COALESCE(t.notes ,"") + CASE WHEN p.notes IS NOT NULL THEN ' / ' ELSE '' END + COALESCE(p.notes ,"")
        } as SelectNodes `
      session2.run(selectquery2).then((results) => {
        const printArray = results.records.map((record) => record.get('SelectNodes'));
        this.setState({ printArray });
        session2.close()
      });

      const session3 = this.driver.session()
      const selectquery3 = `MATCH (n) WHERE ID(n) =` + internalId + ` RETURN n{.*} as SelectNodes `
      session3.run(selectquery3).then((results) => {
        const basicArray = results.records.map((record) => record.get('SelectNodes'));
        this.setState({ basicArray });
        session3.close()
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

//QUERY FOR SELECTED NODE + APPEND BREADCRUMB + OPEN POPUP (CLICK IN CHILD VIEW)
export function selectSwitchInitial(event) {
  this.selectSwitchAppend(event)
  if (this.state.filterDisplay === "filter_container") { this.setState({ popupcontainer: "popupcontainer" }) }
  if (this.state.filterDisplay === "filter_container2") { this.setState({ popupcontainer: "popupcontainer-full" }) }
  if (this.state.filterDisplay === "filter_data_container") { this.setState({ popupcontainer: "popupcontainer-full2" }) }
  else if (this.state.filterDisplay === "filter_data_container hide") { this.setState({ popupcontainer: "popupcontainer-full2" }) }
};



/////////////////////////////////////////////////////////////////////////////////////////////////////
// QUERIES FOR FETCHING FILTER INDEXES ON LOAD //////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

//QUERY TO FETCH LISTS FOR NETWORK SELECTS
export function fetchNetworkIndexes() {
  if (this.state.inputValue !== '') {
    let value = this.state.inputValue.replace("(", "\\(").replace(")", "\\)").replace("[", "\\[").replace("]", "\\]").replace(".", "\\.");;
    let nodeType = this.state.selectedOption
    if (nodeType === "Person") {
      const session = this.driver.session();
      const query = `
          CALL db.index.fulltext.queryNodes("allPropIndex", "`+ value + `~") YIELD node
          WITH node MATCH (node:` + nodeType + `)
          RETURN DISTINCT {type:"node_id", value:node.id, label:node.given_name_western + ' ' + node.family_name_western} AS List
          `
      session.run(query).then((results) => {
        const nodeData = results.records.map((record) => record.get('List'));
        const netPersonIndex = nodeData.map(i => ({ label: i.label, value: i.value, type: "node_id" }));
        this.setState({ netPersonIndex })
        return (this.state.netPersonIndex)
        session.close()
      });
    } else {
      const session = this.driver.session();
      const query = `
          CALL db.index.fulltext.queryNodes("allPropIndex", "`+ value + `~") YIELD node
          WITH node MATCH (node:` + nodeType + `)
          RETURN DISTINCT {type:"node_id", value:node.id, label:node.name_western} AS List
          `
      session.run(query).then((results) => {
        const nodeData = results.records.map((record) => record.get('List'));
        const netPersonIndex = nodeData.map(i => ({ label: i.label, value: i.value, type: "node_id" }));
        this.setState({ netPersonIndex })
        return (this.state.netPersonIndex)
        session.close()
      });
    };
  } else { return null }
  return (this.state.netPersonIndex)

};

//PERSON AFFILIATION INDEX
export function fetchPAffIndex() {
  if (this.state.inputValuePAff !== '') {
    let value = this.state.inputValuePAff.replace("(", "\\(").replace(")", "\\)").replace("[", "\\[").replace("]", "\\]").replace(".", "\\.");;
    const session5 = this.driver.session();
    const query5 = `
      CALL db.index.fulltext.queryNodes("corpPropIndex", "`+ value + `~") YIELD node
      WITH node
      MATCH (node:CorporateEntity {corporate_entity_category: "Religious Body"})-[]-(e)
      RETURN DISTINCT {type:"affiliation", value:node.name_western, label:node.name_western, zh:node.chinese_name_hanzi} AS List
      `
    session5.run(query5).then((results) => {
      const resultIndex5 = results.records.map((record) => record.get('List')); const addAll5 = [{ value: "All", en: "All", zh: "全部", tw: "全部" }];
      const pAffIndexPrep = addAll5.concat(resultIndex5);
      const pAffIndex = pAffIndexPrep.map(i => ({ label: i.value + ` ` + i.zh, value: i.value, zh: i.zh, tw: i.zh, en: i.value, type: "affiliation" }));
      this.setState({ pAffIndex });
      return (this.state.pAffIndex)
      session5.close()
    });
  } else { return null }
  return (this.state.pAffIndex)
};

//INSTITUTION AFFILIATION INDEX
export function fetchAffIndex() {
  if (this.state.inputValueAff !== '') {
    let value = this.state.inputValueAff.replace("(", "\\(").replace(")", "\\)").replace("[", "\\[").replace("]", "\\]").replace(".", "\\.");;
    const session5 = this.driver.session();
    const query5 = `
      CALL db.index.fulltext.queryNodes("corpPropIndex", "`+ value + `~") YIELD node
      WITH node
      MATCH (node:CorporateEntity {corporate_entity_category: "Religious Body"})-[]-(e)
      RETURN DISTINCT {type:"affiliation", value:node.name_western, label:node.name_western, zh:node.chinese_name_hanzi} AS List
      `
    session5.run(query5).then((results) => {
      const resultIndex5 = results.records.map((record) => record.get('List')); const addAll5 = [{ value: "All", en: "All", zh: "全部", tw: "全部" }];
      const affIndexPrep = addAll5.concat(resultIndex5);
      const affIndex = affIndexPrep.map(i => ({ label: i.value + ` ` + i.zh, value: i.value, zh: i.zh, tw: i.zh, en: i.value, type: "affiliation" }));
      this.setState({ affIndex });
      return (this.state.affIndex)
      session5.close()
    });
  } else { return null }
  return (this.state.affIndex)
};

//PERSON NATIONALITY INDEX
export function fetchNatIndex() {
  if (this.state.inputValueNat !== '') {
    let value = this.state.inputValueNat.replace("(", "\\(").replace(")", "\\)").replace("[", "\\[").replace("]", "\\]").replace(".", "\\.");;
    const session5 = this.driver.session();
    const query5 = `
      CALL db.index.fulltext.queryNodes("allPropIndex", "`+ value + `~") YIELD node
      WITH node MATCH (node:Person) WHERE node.nationality IS NOT NULL
      RETURN DISTINCT {type:"affiliation", value:node.nationality, label:node.nationality} AS List
      `
    session5.run(query5).then((results) => {
      const resultIndex5 = results.records.map((record) => record.get('List')); const addAll5 = [{ value: "All" }];
      const natIndexPrep = addAll5.concat(resultIndex5);
      const natIndex = natIndexPrep.map(i => ({ label: i.value, value: i.value, type: "nationality" }));
      this.setState({ natIndex });
      return (this.state.natIndex)
      session5.close()
    });
  } else { return null }
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
    const addAll = [{ category: "All", subcategory: ["All"] }];
    const test = addAll.concat(resultIndex);
    const instCatsIndex = test.map((i) => [i.category, i.subcategory]);
    this.setState({ instCatsIndex });
    session.close()
  });

  //GET RELIGIOUS FAMILY LIST
  const session3 = this.driver.session();
  const query3 = `MATCH (r:Institution)-[]->(e:CorporateEntity) WHERE e.religious_family IS NOT NULL
    RETURN DISTINCT {value:e.religious_family} AS List`
  session3.run(query3).then((results) => {
    const resultIndex3 = results.records.map((record) => record.get('List')); const addAll3 = [{ value: "All" }];
    const relFamIndexPrep = addAll3.concat(resultIndex3);
    const relFamIndex = relFamIndexPrep.map(i => ({ value: i.value, type: "religious_family" }));
    this.setState({ relFamIndex });
    session3.close()
  });

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
    const addAll = [{ category: "All", subcategory: ["All"] }];
    const test = addAll.concat(resultIndex);
    const eventsCatsIndex = test.map((i) => [i.category, i.subcategory]);
    this.setState({ eventsCatsIndex });
    session.close()
  });

};



/////////////////////////////////////////////////////////////////////////////////////////////////////
// QUERIES FOR DATAVIEW /////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
export function fetchDBWide() {
  this.setState({ content: "loading" })
  this.setState({ nodeArray: [] })
  this.setState({ node_id: "" })
  this.setState({ selectedOption: "All" });
  this.setState({ nationality: "" });
  this.setState({ nationalityNull: "" });
  this.setState({ totalPeople: "" });
  this.setState({ totalPublications: "" });
  this.setState({ totalRelationships: "" });
  this.setState({ totalInstitutions: "" });
  this.setState({ instTypeList: "" });
  this.setState({ instDateList: "" });
  this.setState({ totalEvents: "" });
  this.setState({ provinces: "" });
  this.setState({ prefectures: "" });
  this.setState({ counties: "" });
  this.setState({ instDateList: "" });
  this.setState({ genderList: "" });
  this.setState({ genders: "" });
  this.setState({ religiousFamily: "" });
  this.setState({ christianTradition: "" });
  this.setState({ inputValue: ' ' });
  this.setState({ append: this.state.append + 1 })

  //QUERY TO FETCH TOTAL PEOPLE
  const session = this.driver.session();
  const query = `MATCH (n:Person) RETURN count(n) AS Count`
  session.run(query).then((results) => {
    const totalPeople = results.records.map((record) => record.get('Count'));
    this.setState({ totalPeople })
    session.close()
  })

  //QUERY TO FETCH TOTAL INSTITUTIONS
  const session2 = this.driver.session();
  const query2 = `MATCH (n:Institution) RETURN count(n) AS Count`
  session2.run(query2).then((results) => {
    const totalInstitutions = results.records.map((record) => record.get('Count'));
    this.setState({ totalInstitutions })
    session2.close()
  })

  //Total Relationships
  const session3 = this.driver.session();
  const query3 = `MATCH (n)-[r]->() RETURN COUNT(r) AS Count`
  session3.run(query3).then((results) => {
    const totalRelationships = results.records.map((record) => record.get('Count'));
    this.setState({ totalRelationships })
    session3.close()
  })

  //QUERY TO FETCH TOTAL EVENTS
  const session4 = this.driver.session();
  const query4 = `MATCH (n:Event) RETURN count(n) AS Count`
  session4.run(query4).then((results) => {
    const totalEvents = results.records.map((record) => record.get('Count'));
    this.setState({ totalEvents })
    session4.close()
  })

  //QUERY TO FETCH TOTAL PUBLICATIONS
  const session4a = this.driver.session();
  const query4a = `MATCH (n:Publication) RETURN count(n) AS Count`
  session4a.run(query4a).then((results) => {
    const totalPublications = results.records.map((record) => record.get('Count'));
    this.setState({ totalPublications })
    session4a.close()
  })

  //TOTAL NODE COUNT
  const session5 = this.driver.session();
  const query5 = `MATCH (n) RETURN count(n) AS Count`
  session5.run(query5).then((results) => {
    const totalNodes = results.records.map((record) => record.get('Count'));
    this.setState({ totalNodes })
    session5.close()
  })

  //TOTAL CORP ENT
  const session6 = this.driver.session();
  const query6 = `MATCH (n:CorporateEntity) RETURN count(n) AS Count`
  session6.run(query6).then((results) => {
    const totalCorporateEntities = results.records.map((record) => record.get('Count'));
    this.setState({ totalCorporateEntities })
    session6.close()
  })

  //TOTAL GENDER COUNTS
  const session7 = this.driver.session();
  const query7 = `MATCH (n:Person)
    WITH DISTINCT n.gender AS gender, count(*) AS count
    RETURN DISTINCT {gender: gender, count: count} AS List`
  session7.run(query7).then((results) => {
    const genderArray = results.records.map((record) => record.get('List', 'gender'));
    let genders = [];
    for (let i = 0; i < genderArray.length; i++) {
      this.renameProperty(genderArray[i], 'gender', 'key')
      this.renameProperty(genderArray[i], 'count', 'value')
      { genders.push(genderArray[i]) }
    }
    this.setState({ genders })
    session7.close()
  })

  //QUERY TO GET ACTIVITY FOR PROVINCES.
  const session8 = this.driver.session();
  const query8 = `MATCH (p:Province)
      UNWIND p as x
      MATCH (x:Province)<-[:LOCATED_IN|INSIDE_OF*1..5]-(q)<-[:PRESENT_AT]-(n:Person)
      RETURN DISTINCT {Province: {en: x.name_wes, zh: x.name_zh, tw: x.name_zh}, Activity: count(n)} AS List
      ORDER BY List.Activity DESC LIMIT 10
    `
  session8.run(query8).then((results) => {
    const provinces = results.records.map((record) => record.get('List', 'Activity'));
    this.setState({ provinces })
    session8.close()
  })

  //QUERY TO GET ACTIVITY FOR PREFECTURES.
  const session9 = this.driver.session();
  const query9 = `MATCH (p:Prefecture)
      UNWIND p as x
      MATCH (x:Prefecture)<-[:LOCATED_IN|INSIDE_OF*1..4]-(q)<-[:PRESENT_AT]-(n:Person)
      RETURN DISTINCT {Prefecture: {en: x.name_wes, zh: x.name_zh, tw: x.name_zh}, Activity: count(n)} AS List
      ORDER BY List.Activity DESC LIMIT 10
    `
  session9.run(query9).then((results) => {
    const prefectures = results.records.map((record) => record.get('List', 'Activity'));
    this.setState({ prefectures })
    session9.close()
  })

  //QUERY TO GET ACTIVITY FOR COUNTIES.
  const session10 = this.driver.session();
  const query10 = `MATCH (p:County)
      UNWIND p as x
      MATCH (x:County)<-[:LOCATED_IN|INSIDE_OF*1..3]-(q)<-[:PRESENT_AT]-(n:Person)
      RETURN DISTINCT {County: {en: x.name_wes, zh: x.name_zh, tw: x.name_zh}, Activity: count(n)} AS List
      ORDER BY List.Activity DESC LIMIT 10
    `
  session10.run(query10).then((results) => {
    const counties = results.records.map((record) => record.get('List', 'Activity'));
    this.setState({ counties })
    session10.close()
  })

  //Query to get Nationality of all people
  const session11 = this.driver.session();
  const query11 = `MATCH (p:Person) WHERE p.nationality <> "Unknown"
  WITH DISTINCT p
  WITH p.nationality AS nationality, count(*) AS count
  RETURN DISTINCT {info: nationality, count: count} AS List ORDER BY List.count`
  session11.run(query11).then((results) => {
    const nationalityList = results.records.map((record) => record.get('List', 'info'));
    const nationality = nationalityList.filter(d => d.count >= 50)
    this.setState({ nationality })
    session11.close()
  })

  //Query to get Nationality of all people
  const session12 = this.driver.session();
  const query12 = `MATCH (p:Person) WHERE p.nationality IS NULL OR p.nationality = "Unknown"
  WITH DISTINCT p
  RETURN count(p) as Count`
  session12.run(query12).then((results) => {
    const nationalityNull = results.records.map((record) => record.get('Count', 'info'));
    this.setState({ nationalityNull })
    session12.close()
  })

  //QUERY TO GET CHRISTIAN TRADITIONS OF ALL NODES
  const session13 = this.driver.session();
  const query13 = `
    MATCH (n) WHERE labels(n)[0] = "CorporateEntity" OR labels(n)[0] = "Institution" OR labels(n)[0]="Event"
    WITH n.christian_tradition AS christian_tradition, count(n) AS count
    WHERE n.christian_tradition IS NOT NULL
    RETURN DISTINCT {christian_tradition: christian_tradition, count: count} AS List
    `
  session13.run(query13).then((results) => {
    const christianTraditionList = results.records.map((record) => record.get('List', 'christian_tradition'));
    let christianTradition = [];
    for (let i = 0; i < christianTraditionList.length; i++) {
      this.renameProperty(christianTraditionList[i], 'christian_tradition', 'key')
      this.renameProperty(christianTraditionList[i], 'count', 'value')
      { christianTradition.push(christianTraditionList[i]) }
    }
    this.setState({ christianTradition })
    session13.close()
  })

  //QUERY TO GET RELIGIOUS FAMILIES OF ALL NODES
  const session14 = this.driver.session();
  const query14 = `
    MATCH (n) WHERE labels(n)[0] = "CorporateEntity" OR labels(n)[0] = "Institution" OR labels(n)[0]="Event"
    WITH n.religious_family AS religious_family, count(n) AS count
    WHERE n.religious_family IS NOT NULL
    RETURN DISTINCT {religious_family: religious_family, count: count} AS List
    `
  session14.run(query14).then((results) => {
    const religiousFamilyList = results.records.map((record) => record.get('List', 'religious_family'));
    const religiousFamilyClean = religiousFamilyList.filter(d => d.count >= 10)
    let religiousFamily = [];
    for (let i = 0; i < religiousFamilyClean.length; i++) {
      this.renameProperty(religiousFamilyClean[i], 'religious_family', 'key')
      this.renameProperty(religiousFamilyClean[i], 'count', 'value')
      { religiousFamily.push(religiousFamilyClean[i]) }
    }
    this.setState({ religiousFamily })
    session14.close()
  })

  //QUERY TO GET CHRISTIAN TRADITIONS OF NULL VALUE
  const session15 = this.driver.session();
  const query15 = `
    MATCH (n)
    WITH n.religious_family AS religious_family, count(n) AS count
    WHERE n.religious_family IS NULL
    RETURN count AS Count
    `
  session15.run(query15).then((results) => {
    const religiousFamilyNullValues = results.records.map((record) => record.get('Count', 'religious_family'));
    this.setState({ religiousFamilyNullValues })
    session.close()
  })

  //QUERY TO GET CHRISTIAN TRADITIONS OF NULL VALUE
  const session16 = this.driver.session();
  const query16 = `
    MATCH (n)
    WITH n.christian_tradition AS christian_tradition, count(n) AS count
    WHERE n.christian_tradition IS NULL
    RETURN count AS Count
    `
  session16.run(query16).then((results) => {
    const christianTraditionNullValues = results.records.map((record) => record.get('Count', 'christian_tradition'));
    this.setState({ christianTraditionNullValues })
    session16.close()
  })

  this.setState({ content: "loaded" })
}

// GET CORP ENT DATA FOR DATA DASHBOARD SELECT
export function fetchCorpOptions() {
  const session = this.driver.session();
  const query = `MATCH (c:CorporateEntity)--(p:Person) WHERE c.corporate_entity_category = "Religious Body"
  WITH DISTINCT c
  RETURN {value: c.id, label: c.name_western, label_alt:c.chinese_name_hanzi, type:labels(c)[0]} as List
  `
  session.run(query).then((results) => {
    const corpOptions = results.records.map((record) => record.get('List', 'Activity'));
    this.setState({ corpOptions })
    session.close()
  })
};

// GET INST DATA FOR DATA DASHBOARD SELECT
export function fetchInstOptions() {
  const session = this.driver.session();
  const query = `MATCH (c:Institution)--(p:Person) WHERE c.institution_subcategory <> 'General Work'
  WITH DISTINCT c
  RETURN {value: c.id, label: c.name_western, label_alt:c.chinese_name_hanzi, type:labels(c)[0]} as List
  `
  session.run(query).then((results) => {
    const instOptions = results.records.map((record) => record.get('List', 'Activity'));
    this.setState({ instOptions })
    session.close()
  })
};

//GET GEO DATA FOR DATA DASHBOARD SELECT
export function fetchGeoOptions() {
  const session = this.driver.session();
  const query = `MATCH (c)--(i)
    WHERE (c:Village OR c:Township OR c:County OR c:Prefecture OR c:Province) AND (i:Event OR i:Institution)
    WITH DISTINCT c
    MATCH (c)-[:INSIDE_OF]->(d) WHERE (d:Township OR d:County OR d:Prefecture OR d:Province OR d:Nation)
    RETURN {value: c.id, label: c.name_wes+", "+d.name_wes, label_alt:c.name_zh+", "+d.name_zh, type:labels(c)[0]} as List
  `
  session.run(query).then((results) => {
    const geoOptions = results.records.map((record) => record.get('List', 'Activity'));
    this.setState({ geoOptions })
    session.close()
  })
};

//QUERY TO GET DATA FOR INST DATA VIEWS
export function fetchInstitutionsData() {
  if (this.state.node_id === "" && this.state.nodeSelect === "") {
    this.setState({ nosend: "nosend" })
  }
  else {
    this.setState({ content: "loading" })
    let selectedOption = "Institution"
    this.setState({ selectedOption });
    this.setState({ nationality: "" });
    this.setState({ nationalityNull: "" });
    this.setState({ totalPeople: "" });
    this.setState({ totalRelationships: "" });
    this.setState({ totalInstitutions: "" });
    this.setState({ totalEvents: "" });
    this.setState({ provinces: "" });
    this.setState({ instDateList: "" });
    this.setState({ genderList: "" });
    this.setState({ genders: "" });
    this.setState({ religiousFamily: "" });
    this.setState({ christianTradition: "" });
    this.setState({ inputValue: ' ' });
    this.setState({ append: this.state.append + 1 })

    //SET CENTRAL NODE
    let nodeIdFilter;
    fetchNeo4jId(this.state.node_id, this.driver)
      .then((internalId) => {
        if (this.state.node_id !== "") {
          nodeIdFilter = '' + parseFloat(internalId) + ' '
        } else { nodeIdFilter = "" };

        //FETCH COUNTS
        const session = this.driver.session();
        const query = `
      MATCH (n) WHERE id(n)=`+ nodeIdFilter + `
      WITH n
      CALL {
        WITH n
        MATCH (n)--(p:Person)
        RETURN count(DISTINCT p) as person
      }
      CALL {
        WITH n
        MATCH (n)--(p:Event)
        RETURN count(DISTINCT p) as eventcount
      }
      CALL apoc.cypher.run('MATCH (t:CorporateEntity)-[]-(p) wHERE id(p)=`+ nodeIdFilter + ` WITH DISTINCT t RETURN count(*) as count',{}) YIELD value as corp
      RETURN n as node, person as count, eventcount, corp.count as corpcount`
        session
          .run(query)
          .then((results) => {
            const newArray = results.records.map((record) => record.get('node'));
            const nodeArray = newArray[0];
            const totalPeople = results.records.map((record) => record.get('count'));
            const totalInstitutions = 1
            const totalCorporateEntities = results.records.map((record) => record.get('corpcount'));
            const totalEvents = results.records.map((record) => record.get('eventcount'));
            if (nodeArray.length === 0) { this.setState({ noresults: "noresults" }) }
            else {
              this.setState({ nodeArray });
              this.setState({ totalPeople })
              this.setState({ totalInstitutions })
              this.setState({ totalCorporateEntities })
              this.setState({ totalEvents })
              this.setState({ noresults: "noresults hide" })
              this.setState({ content: "loaded" })
            }
            session.close()
          });
        //FETCH (AND CLEAN) GENDER COUNTS
        const session2 = this.driver.session();
        const query2 = `MATCH (n) WHERE id(n)=` + nodeIdFilter + `
      CALL {
          WITH n
          MATCH (n)--(p:Person)
          RETURN DISTINCT p
      }
      WITH p.gender AS gender, count(*) AS count
      RETURN DISTINCT {gender: gender, count: count} AS List`
        session2.run(query2).then((results) => {
          const genderArray = results.records.map((record) => record.get('List', 'gender'));
          let genders = [];
          for (let i = 0; i < genderArray.length; i++) {
            this.renameProperty(genderArray[i], 'gender', 'key')
            this.renameProperty(genderArray[i], 'count', 'value')
            { genders.push(genderArray[i]) }
          }
          this.setState({ genders });
          session2.close()
        })

        // FETCH GENDER ACTIVITY
        const session2b = this.driver.session();
        const query2b = `
    MATCH (n) WHERE id(n)=`+ nodeIdFilter + `
    CALL {
      WITH n
      MATCH (n)-[t]-(p:Person) WHERE p.gender IS NOT NULL AND t.start_year IS NOT NULL
      WITH p, t.start_year as min, CASE WHEN t.end_year IS NOT NULL THEN t.end_year ELSE t.start_year END as max
      RETURN DISTINCT p, p.gender as gender, range(toInteger(min), toInteger(max)) as range
    }
    WITH DISTINCT gender, apoc.coll.flatten(COLLECT(range)) as years
    WITH gender,  apoc.coll.frequencies(years) as freq UNWIND freq as freq_occur
    WITH apoc.map.fromValues([toLower(gender), freq_occur.count]) as gender_count, freq_occur.item as year
    UNWIND keys(gender_count) as key 
    WITH CASE
      WHEN key = "male" THEN {info: year, male: gender_count[key], female: 0, unknown: 0}
      WHEN key = "female" THEN {info: year, male: 0, female: gender_count[key], unknown: 0}
      ELSE {info: year, male: 0, female: 0, unknown: gender_count[key]}
      END as List
    WITH List UNWIND List as item
    WITH {
      info: item.info,
      female:apoc.coll.sumLongs(apoc.coll.toSet(apoc.coll.flatten(collect(item.female)))),
      male:apoc.coll.sumLongs(apoc.coll.toSet(apoc.coll.flatten(collect(item.male)))),
      unknown:apoc.coll.sumLongs(apoc.coll.toSet(apoc.coll.flatten(collect(item.unknown))))
    } as item2 ORDER BY item2.info
    RETURN item2 as List
      `
        session2b.run(query2b).then((results) => {
          const genderListInit = results.records.map((record) => record.get('List', 'Activity'));
          const genderList = genderListInit.filter(d => (d.info >= 1550 && d.info <= 1950))
          this.setState({ genderList })
          session2b.close()
        })

        //FETCH NATIONALITY
        const session3 = this.driver.session();
        const query3 = `MATCH (n) WHERE id(n)=` + nodeIdFilter + `
    CALL {
      WITH n
      MATCH (n)--(p:Person) WHERE p.nationality <> "Unknown"
      RETURN DISTINCT p
    }
    WITH p.nationality AS nationality, count(*) AS count
    RETURN DISTINCT {info: nationality, count: count} AS List ORDER BY List.count`
        session3.run(query3).then((results) => {
          const nationalityList = results.records.map((record) => record.get('List', 'info'));
          const nationality = nationalityList.filter(d => d.count >= 1)
          this.setState({ nationality })
          session3.close()
        })

        //FETCH NATIONALITY (NULL)
        const session4 = this.driver.session();
        const query4 = `MATCH (n) WHERE id(n)=` + nodeIdFilter + `
    CALL {
        WITH n
        MATCH (n)--(p:Person) WHERE p.nationality IS NULL OR p.nationality = "Unknown"
        RETURN DISTINCT p
    }
    RETURN count(p) as Count`
        session4.run(query4).then((results) => {
          const nationalityNull = results.records.map((record) => record.get('Count', 'info'));
          this.setState({ nationalityNull })
          session4.close()
        })

        //FETCH PEOPLE PRESENT BY YEAR
        const session8 = this.driver.session();
        const query8 = `
    MATCH (p) WHERE id(p)=`+ nodeIdFilter + `
    CALL {
      WITH p
      MATCH (p)-[t]-(q:Person) WHERE t.start_year IS NOT NULL
      WITH DISTINCT q, t.start_year as min, CASE WHEN t.end_year IS NOT NULL THEN t.end_year ELSE t.start_year END as max
      RETURN q.id as name, range(toInteger(min), toInteger(max)) as years
      }
    WITH name, apoc.coll.flatten(collect(years)) as year_list
    UNWIND year_list as all_years
    RETURN {info: toInteger(all_years), count: toInteger(count(distinct name))} as List  ORDER BY List.info`
        session8.run(query8).then((results) => {
          const instList = results.records.map((record) => record.get('List', 'info'));
          const instDateList = instList.filter(d => (d.count >= 1 && d.info >= 1550 && d.info <= 1950))
          this.setState({ instDateList })
          session8.close()
        })

        //FETCH CHRISTIAN_TRADITION
        const session9 = this.driver.session();
        const query9 = `
    MATCH (p) WHERE id(p)=`+ nodeIdFilter + `
    CALL {
      WITH p
      MATCH (p)--(n:Person)--(t:CorporateEntity) WHERE EXISTS(t.christian_tradition)
      WITH DISTINCT t.christian_tradition as name, count(DISTINCT n) AS count
      RETURN name, count AS Count
    }
    RETURN DISTINCT {christian_tradition: name, count: Count} AS List
    `
        session9.run(query9).then((results) => {
          const christianTraditionList = results.records.map((record) => record.get('List', 'christian_tradition'));
          let christianTradition = [];
          for (let i = 0; i < christianTraditionList.length; i++) {
            this.renameProperty(christianTraditionList[i], 'christian_tradition', 'key')
            this.renameProperty(christianTraditionList[i], 'count', 'value')
            { christianTradition.push(christianTraditionList[i]) }
          }
          this.setState({ christianTradition })
          session9.close()
        })

        //FETCH RELIGIOUS_FAMILY
        const session10 = this.driver.session();
        const query10 = `
    MATCH (p) WHERE id(p)=`+ nodeIdFilter + `
    CALL {
      WITH p
      MATCH (p)--(n:Person)--(t:CorporateEntity)
      WITH DISTINCT CASE t.religious_family 
      WHEN NULL THEN "Unknown"
      ELSE t.religious_family END AS  name, count(DISTINCT n) AS count
      RETURN name, count AS Count
    }
    RETURN DISTINCT {religious_family: name, count: Count} AS List
    `
        session10.run(query10).then((results) => {
          const religiousFamilyList = results.records.map((record) => record.get('List', 'religious_family'));
          const religiousFamilyClean = religiousFamilyList.filter(d => d.count >= 0)
          let religiousFamily = [];
          for (let i = 0; i < religiousFamilyClean.length; i++) {
            this.renameProperty(religiousFamilyClean[i], 'religious_family', 'key')
            this.renameProperty(religiousFamilyClean[i], 'count', 'value')
            { religiousFamily.push(religiousFamilyClean[i]) }
          }
          this.setState({ religiousFamily })
          session10.close()
        })

        //FETCH RELIGIOUS_FAMILY NULL
        const session11 = this.driver.session();
        const query11 = `
        MATCH (p) WHERE id(p)=`+ nodeIdFilter + `
        CALL {
          WITH p
          MATCH (p)--(n:Person)--(t:CorporateEntity) WHERE t.religious_family IS NULL
          RETURN count(DISTINCT n) AS count
        }
        RETURN count AS Count
        `
        session11.run(query11).then((results) => {
          const religiousFamilyNullValues = results.records.map((record) => record.get('Count', 'religious_family'));
          this.setState({ religiousFamilyNullValues })
          session11.close()
        })

        //FETCH CHRISTIAN TRADITION NULL
        const session12 = this.driver.session();
        const query12 = `
        MATCH (p) WHERE id(p)=`+ nodeIdFilter + `
        CALL {
          WITH p
          MATCH (p)--(n:Person)--(t:CorporateEntity) WHERE t.christian_tradition IS NULL
          RETURN count(DISTINCT n) AS count
        }
        RETURN count AS Count
      `
        session12.run(query12).then((results) => {
          const christianTraditionNullValues = results.records.map((record) => record.get('Count', 'christian_tradition'));
          this.setState({ christianTraditionNullValues })
          session12.close()
        })
      })
      .catch((error) => {
        console.error("Error:", error);
      });

  };
}
//QUERY TO GET DATA FOR CORPORATE DATA VIEWS
export function fetchCorporateEntitiesData() {
  if (this.state.node_id === "" && this.state.nodeSelect === "") {
    this.setState({ nosend: "nosend" })
  }
  else {
    this.setState({ content: "loading" })
    let selectedOption = "CorporateEntity"
    this.setState({ selectedOption });
    this.setState({ nationality: "" });
    this.setState({ nationalityNull: "" });
    this.setState({ totalPeople: "" });
    this.setState({ totalRelationships: "" });
    this.setState({ totalInstitutions: "" });
    this.setState({ totalEvents: "" });
    this.setState({ prefectures: "" });
    this.setState({ provinces: "" });
    this.setState({ counties: "" });
    this.setState({ instDateList: "" });
    this.setState({ instTypeList: "" });
    this.setState({ genderList: "" });
    this.setState({ genders: "" });
    this.setState({ religiousFamily: "" });
    this.setState({ christianTradition: "" });
    this.setState({ christianTradition: "" });
    this.setState({ inputValue: ' ' });
    this.setState({ append: this.state.append + 1 })

    //SET CENTRAL NODE
    let nodeIdFilter;
    fetchNeo4jId(this.state.node_id, this.driver)
      .then((internalId) => {
        if (this.state.node_id !== "") {
          nodeIdFilter = '' + parseFloat(internalId) + ' '
        } else { nodeIdFilter = "" };

        //FETCH COUNTS
        const session = this.driver.session();
        const query = `
      MATCH (n) WHERE id(n)=`+ nodeIdFilter + `
      WITH n
      CALL {
        WITH n
        MATCH (n)--(q:Institution)-[t]-(p:Person) 
        OPTIONAL MATCH (n)--(p:Person)--(q)
        RETURN count(DISTINCT p) as person
      }
      CALL {
        WITH n
        MATCH (n)--(:Person)-[t]-(p:Institution) 
        OPTIONAL MATCH (n)--(p:Institution)
        RETURN count(DISTINCT p) as instcount
      }
      CALL {
        WITH n
        MATCH (n)--(:Person)-[t]-(p:Event)
        OPTIONAL MATCH (n)--(p:Event)
        RETURN count(DISTINCT p) as eventcount
      }
      CALL apoc.cypher.run('MATCH (t:CorporateEntity)-[]-(p) WHERE id(p)=`+ nodeIdFilter + ` WITH DISTINCT t RETURN count(*) as count',{}) YIELD value as corp
      RETURN n as node, person as count, instcount, eventcount, corp.count as corpcount`
      console.log(query)
        session
          .run(query)
          .then((results) => {
            const newArray = results.records.map((record) => record.get('node'));
            const nodeArray = newArray[0];
            const totalPeople = results.records.map((record) => record.get('count'));
            const totalInstitutions = results.records.map((record) => record.get('instcount'));
            const totalCorporateEntities = results.records.map((record) => record.get('corpcount'));
            const totalEvents = results.records.map((record) => record.get('eventcount'));
            if (nodeArray.length === 0) { this.setState({ noresults: "noresults" }) }
            else {
              this.setState({ nodeArray });
              this.setState({ totalPeople });
              this.setState({ totalInstitutions });
              this.setState({ totalCorporateEntities });
              this.setState({ totalEvents });
              this.setState({ noresults: "noresults hide" })
              this.setState({ content: "loaded" })
            }
            session.close()
          });

        //FETCH (AND CLEAN) GENDER COUNTS
        const session2 = this.driver.session();
        const query2 = `MATCH (n) WHERE id(n)=` + nodeIdFilter + `
      CALL {
          WITH n
          MATCH (n)--(p:Person)--(q) 
          OPTIONAL MATCH (n)--(q:Institution)-[t]-(p:Person)
          RETURN DISTINCT p
      }
      WITH p.gender AS gender, count(*) AS count
      RETURN DISTINCT {gender: gender, count: count} AS List`
      console.log(query2)
        session2.run(query2).then((results) => {
          const genderArray = results.records.map((record) => record.get('List', 'gender'));
          let genders = [];
          for (let i = 0; i < genderArray.length; i++) {
            this.renameProperty(genderArray[i], 'gender', 'key')
            this.renameProperty(genderArray[i], 'count', 'value')
            { genders.push(genderArray[i]) }
          }
          this.setState({ genders });
          session2.close()
        })

        // FETCH GENDER ACTIVITY
        const session2b = this.driver.session();
        const query2b = `
    MATCH (n) WHERE id(n)=`+ nodeIdFilter + `
    CALL {
      WITH n
      MATCH (n)-[t]-(p:Person)--(q) WHERE id(n)=`+ nodeIdFilter + ` AND p.gender IS NOT NULL AND t.start_year IS NOT NULL 
      OPTIONAL MATCH (n)--(q:Institution)-[t]-(p:Person) WHERE id(n)=`+ nodeIdFilter + ` AND p.gender IS NOT NULL AND t.start_year IS NOT NULL
      WITH p, t.start_year as min, CASE WHEN t.end_year IS NOT NULL THEN t.end_year ELSE t.start_year END as max
      RETURN DISTINCT p, p.gender as gender, range(toInteger(min), toInteger(max)) as range
    }
    WITH DISTINCT gender, apoc.coll.flatten(COLLECT(range)) as years
    WITH gender,  apoc.coll.frequencies(years) as freq UNWIND freq as freq_occur
    WITH apoc.map.fromValues([toLower(gender), freq_occur.count]) as gender_count, freq_occur.item as year
    UNWIND keys(gender_count) as key 
    WITH CASE
      WHEN key = "male" THEN {info: year, male: gender_count[key], female: 0, unknown: 0}
      WHEN key = "female" THEN {info: year, male: 0, female: gender_count[key], unknown: 0}
      ELSE {info: year, male: 0, female: 0, unknown: gender_count[key]}
      END as List
    WITH List UNWIND List as item
    WITH {
      info: item.info,
      female:apoc.coll.sumLongs(apoc.coll.toSet(apoc.coll.flatten(collect(item.female)))),
      male:apoc.coll.sumLongs(apoc.coll.toSet(apoc.coll.flatten(collect(item.male)))),
      unknown:apoc.coll.sumLongs(apoc.coll.toSet(apoc.coll.flatten(collect(item.unknown))))
    } as item2 ORDER BY item2.info
    RETURN item2 as List
      `
        session2b.run(query2b).then((results) => {
          const genderListInit = results.records.map((record) => record.get('List', 'Activity'));
          const genderListInitA = genderListInit.filter(d => (d.info >= 1550 && d.info <= 1950))
          const genderListFilter1 = genderListInitA.filter((o, i) => !i || o.female >= (genderListInitA[i - 1].female * .25));
          const genderListFilter2 = genderListFilter1.filter((o, i) => !i || o.female >= (genderListFilter1[i - 1].female * .25));
          const genderListFilter3 = genderListFilter2.filter((o, i) => !i || o.male >= (genderListFilter2[i - 1].male * .25));
          const genderList = genderListFilter3.filter((o, i) => !i || o.male >= (genderListFilter3[i - 1].male * .25));
          this.setState({ genderList })
          session2b.close()
        })

        //FETCH NATIONALITY
        const session3 = this.driver.session();
        const query3 = `MATCH (n) WHERE id(n)=` + nodeIdFilter + `
    CALL {
      WITH n
      MATCH (n)--(p:Person) WHERE p.nationality <> "Unknown"
      OPTIONAL MATCH (n)--(:Institution)-[t]-(p:Person) WHERE p.nationality <> "Unknown"
      RETURN DISTINCT p
    }
    WITH p.nationality AS nationality, count(*) AS count
    RETURN DISTINCT {info: nationality, count: count} AS List ORDER BY List.count`
        session3.run(query3).then((results) => {
          const nationalityList = results.records.map((record) => record.get('List', 'info'));
          const nationality = nationalityList.filter(d => d.count >= 1)
          this.setState({ nationality })
          session3.close()
        })

        //FETCH NATIONALITY (NULL)
        const session4 = this.driver.session();
        const query4 = `MATCH (n) WHERE id(n)=` + nodeIdFilter + `
    CALL {
        WITH n
        MATCH (n)--(p:Person) WHERE p.nationality IS NULL OR p.nationality = "Unknown"
        OPTIONAL MATCH (n)--(:Institution)-[t]-(p:Person) WHERE p.nationality IS NULL OR p.nationality = "Unknown"
        RETURN DISTINCT p
    }
    RETURN count(p) as Count`
        session4.run(query4).then((results) => {
          const nationalityNull = results.records.map((record) => record.get('Count', 'info'));
          this.setState({ nationalityNull })
          session4.close()
        })

        // FETCH COUNTY ACTIVITY
        const session5 = this.driver.session();
        const query5 = `MATCH (e)--(p:Person)--(i:Institution)--(o) 
    WHERE id(e)=`+ nodeIdFilter + ` AND (o:Village OR o:Township OR o:County OR o:Prefecture OR o:Province)
    WITH count(distinct p) as count, o
    CALL apoc.path.subgraphAll(o, {
      relationshipFilter: "INSIDE_OF>",
        labelFilter:'/County',
        maxLevel: 4
    })
    YIELD nodes, relationships
    WITH count, 
    CASE labels(o)[0] WHEN "Province" THEN NULL WHEN "Prefecture" THEN NULL
    ELSE 
      CASE labels(nodes[0])[0]  WHEN NULL THEN o.name_wes ELSE nodes[0].name_wes END
    END AS prov,
    CASE labels(o)[0] WHEN "Province" THEN NULL WHEN "Prefecture" THEN NULL
    ELSE 
      CASE labels(nodes[0])[0]  WHEN NULL THEN o.name_zh ELSE nodes[0].name_zh END
    END AS provzh
    WITH {County: {en: prov, zh: provzh, tw: provzh}, Activity: sum(count)} AS Lister ORDER BY Lister.Activity DESC
    WITH [prov in COLLECT(Lister) WHERE prov.County IS NOT NULL] as filter1 UNWIND filter1 as List
    RETURN List LIMIT 10`

        session5.run(query5).then((results) => {
          const counties1 = results.records.map((record) => record.get('List', 'Activity'));
          const counties = counties1.filter(d => (d.County.en !== null))
          this.setState({ counties })
          session5.close()
        })

        // FETCH PREFECTURE ACTIVITY
        const session6 = this.driver.session();
        const query6 = `MATCH (e)--(p:Person)--(i:Institution)--(o) 
    WHERE id(e)=`+ nodeIdFilter + ` AND (o:Village OR o:Township OR o:County OR o:Prefecture OR o:Province)
    WITH count(distinct p) as count, o
    CALL apoc.path.subgraphAll(o, {
      relationshipFilter: "INSIDE_OF>",
        labelFilter:'/Prefecture',
        maxLevel: 4
    })
    YIELD nodes, relationships
    WITH count, 
    CASE labels(o)[0] WHEN "Province" THEN NULL ELSE 
      CASE labels(nodes[0])[0]  WHEN NULL THEN o.name_wes ELSE nodes[0].name_wes END
    END AS prov,
    CASE labels(o)[0] WHEN "Province" THEN NULL ELSE 
      CASE labels(nodes[0])[0]  WHEN NULL THEN o.name_zh ELSE nodes[0].name_zh END
    END AS provzh
    WITH {Prefecture: {en: prov, zh: provzh, tw: provzh}, Activity: sum(count)} AS Lister ORDER BY Lister.Activity DESC
    WITH [prov in COLLECT(Lister) WHERE prov.Prefecture IS NOT NULL] as filter1 UNWIND filter1 as List
    RETURN List LIMIT 10`

        session6.run(query6).then((results) => {
          const prefectures1 = results.records.map((record) => record.get('List', 'Activity'));
          const prefectures = prefectures1.filter(d => (d.Prefecture.en !== null))
          this.setState({ prefectures })
          session6.close()
        })

        // FETCH PROVINCE ACTIVITY
        const session7 = this.driver.session();
        const query7 = `MATCH (e)--(p:Person)--(i:Institution)--(o) 
    WHERE id(e)=`+ nodeIdFilter + ` AND (o:Village OR o:Township OR o:County OR o:Prefecture OR o:Province)
    WITH count(distinct p) as count, o
    CALL apoc.path.subgraphAll(o, {
      relationshipFilter: "INSIDE_OF>",
        labelFilter:'/Province',
        maxLevel: 4
    })
    YIELD nodes, relationships
    WITH count, 
    CASE labels(nodes[0])[0]  WHEN NULL THEN o.name_wes ELSE nodes[0].name_wes END as prov,
    CASE labels(nodes[0])[0]  WHEN NULL THEN o.name_zh ELSE nodes[0].name_zh END as provzh
    RETURN DISTINCT {Province: {en: prov, zh: provzh, tw: provzh}, Activity: sum(count)} AS List ORDER BY List.Activity DESC LIMIT 10`

        session7.run(query7).then((results) => {
          const provinces1 = results.records.map((record) => record.get('List', 'Activity'));
          const provinces = provinces1.filter(d => (d.Province.en !== null))
          this.setState({ provinces })
          session7.close()
        })

        //FETCH INSTITUTIONS BY YEAR
        const session8 = this.driver.session();
        const query8 = `
    MATCH (p) WHERE id(p)=`+ nodeIdFilter + `
    CALL {
      WITH p
      MATCH (p)--(q:Person)-[t]-(i:Institution) WHERE t.start_year IS NOT NULL
      OPTIONAL MATCH (p)--(i:Institution)-[t]-(q:Person) WHERE t.start_year IS NOT NULL
      OPTIONAL MATCH (p)-[t]-(i:Institution) WHERE t.start_year IS NOT NULL
      WITH DISTINCT i, t.start_year as min, CASE WHEN t.end_year IS NOT NULL THEN t.end_year ELSE t.start_year END as max
      RETURN i.name_western as name, range(toInteger(min), toInteger(max)) as years
      }
    WITH name, apoc.coll.flatten(collect(years)) as year_list
    UNWIND year_list as all_years
    RETURN {info: toInteger(all_years), count: toInteger(count(distinct name))} as List  ORDER BY List.info`
        session8.run(query8).then((results) => {
          const instList = results.records.map((record) => record.get('List', 'info'));
          const filteredInstList = instList.filter(d => (d.count > 0 && d.info >= 1550 && d.info <= 1950))
          const instDateList1 = filteredInstList.filter((o, i) => !i || o.count > (filteredInstList[i - 1].count * .25));
          const instDateList2 = instDateList1.filter((o, i) => !i || o.count > (instDateList1[i - 1].count * .25));
          const instDateList3 = instDateList2.filter((o, i) => !i || o.count > (instDateList2[i - 1].count * .25));
          const instDateList = instDateList3.filter((o, i) => !i || o.count > (instDateList3[i - 1].count * .25));
          this.setState({ instDateList })
          session8.close()
        })

        //FETCH INSTITUTIONS TYPES
        const session9 = this.driver.session();
        const query9 = `MATCH (n) WHERE id(n)=` + nodeIdFilter + `
      CALL {
          WITH n
          MATCH (n)--(:Person)--(i:Institution) 
          OPTIONAL MATCH (n)--(i:Institution)
          RETURN DISTINCT i
      }
    WITH CASE i.institution_category
      WHEN NULL THEN "N/A" 
      ELSE i.institution_category END AS type, count(*) AS count
    RETURN DISTINCT {type: type, count: count} AS List`
        session9.run(query9).then((results) => {
          const instArray = results.records.map((record) => record.get('List', 'type'));
          let instTypeList = [];
          for (let i = 0; i < instArray.length; i++) {
            this.renameProperty(instArray[i], 'type', 'key')
            this.renameProperty(instArray[i], 'count', 'value')
            { instTypeList.push(instArray[i]) }
          }
          this.setState({ instTypeList });
          session9.close()
        })
      })
      .catch((error) => {
        console.error("Error:", error);
      });

  }
};

//QUERY TO GET DATA FOR GEO DATA VIEWS
export function fetchGeographyData() {
  if (this.state.node_id === "" && this.state.nodeSelect === "") {
    this.setState({ nosend: "nosend" })
  }
  else {
    let selectedOption = "Geography"
    this.setState({ content: "loading" })
    this.setState({ selectedOption });
    this.setState({ nationality: "" });
    this.setState({ nationalityNull: "" });
    this.setState({ totalPeople: "" });
    this.setState({ totalRelationships: "" });
    this.setState({ totalInstitutions: "" });
    this.setState({ instTypeList: "" });
    this.setState({ instDateList: "" });
    this.setState({ totalEvents: "" });
    this.setState({ provinces: "" });
    this.setState({ prefectures: "" });
    this.setState({ counties: "" });
    this.setState({ instDateList: "" });
    this.setState({ genderList: "" });
    this.setState({ genders: "" });
    this.setState({ religiousFamily: "" });
    this.setState({ christianTradition: "" });
    this.setState({ inputValue: ' ' })
    this.setState({ append: this.state.append + 1 })


    //SET CENTRAL NODE
    let nodeIdFilter;
    fetchNeo4jId(this.state.node_id, this.driver)
      .then((internalId) => {
        if (this.state.node_id !== "") {
          nodeIdFilter = '' + parseFloat(internalId) + ' '
        } else { nodeIdFilter = "" };

        //FETCH COUNTS
        const session = this.driver.session();
        const query = `
      MATCH (n) WHERE id(n)=`+ nodeIdFilter + `
      WITH n
      CALL {
        WITH n
        MATCH (n)--(t)--(p:Person) WHERE t:Institution OR t:Event
        RETURN count(DISTINCT p) as person
      }
      CALL {
        WITH n
        MATCH (n)--(p:Institution)
        RETURN count(DISTINCT p) as instcount
      }
      CALL {
        WITH n
        MATCH (n)--(p:Event)
        RETURN count(DISTINCT p) as eventcount
      }
      CALL {
        WITH n
        MATCH (n)-[t*1..2]-(p:CorporateEntity)
        RETURN count(DISTINCT p) as corpcount
      }
      RETURN n as node, person as count, instcount, eventcount, corpcount`
        session
          .run(query)
          .then((results) => {
            const newArray = results.records.map((record) => record.get('node'));
            const nodeArray = newArray[0];
            const totalPeople = results.records.map((record) => record.get('count'));
            const totalInstitutions = results.records.map((record) => record.get('instcount'));
            const totalCorporateEntities = results.records.map((record) => record.get('corpcount'));
            const totalEvents = results.records.map((record) => record.get('eventcount'));
            if (nodeArray.length === 0) { this.setState({ noresults: "noresults" }) }
            else {
              this.setState({ nodeArray });
              this.setState({ totalPeople });
              this.setState({ totalInstitutions });
              this.setState({ totalCorporateEntities });
              this.setState({ totalEvents });
              this.setState({ noresults: "noresults hide" })
              this.setState({ content: "loaded" })
            }
            session.close()
          });

        //FETCH (AND CLEAN) GENDER COUNTS
        const session2 = this.driver.session();
        const query2 = `MATCH (n) WHERE id(n)=` + nodeIdFilter + `
    CALL {
      WITH n
      MATCH (n)--(t)--(p:Person) WHERE t:Event or t:Institution
      RETURN DISTINCT p
    }
    WITH p.gender AS gender, count(*) AS count
    RETURN DISTINCT {gender: gender, count: count} AS List`
        session2.run(query2).then((results) => {
          const genderArray = results.records.map((record) => record.get('List', 'gender'));
          let genders = [];
          for (let i = 0; i < genderArray.length; i++) {
            this.renameProperty(genderArray[i], 'gender', 'key')
            this.renameProperty(genderArray[i], 'count', 'value')
            { genders.push(genderArray[i]) }
          }
          this.setState({ genders })
          session2.close()
        })

        // FETCH GENDER ACTIVITY
        const session2b = this.driver.session();
        const query2b = `
    MATCH (n) WHERE id(n)=`+ nodeIdFilter + `
    CALL {
      WITH n
      MATCH (n)--(q)-[t]-(p:Person) WHERE q:Event or q:Institution AND id(n)=`+ nodeIdFilter + ` AND p.gender IS NOT NULL AND t.start_year IS NOT NULL
      WITH p, t.start_year as min, CASE WHEN t.end_year IS NOT NULL THEN t.end_year ELSE t.start_year END as max
      RETURN DISTINCT p, p.gender as gender, range(toInteger(min), toInteger(max)) as range
    }
    WITH DISTINCT gender, apoc.coll.flatten(COLLECT(range)) as years
    WITH gender,  apoc.coll.frequencies(years) as freq UNWIND freq as freq_occur
    WITH apoc.map.fromValues([toLower(gender), freq_occur.count]) as gender_count, freq_occur.item as year
    UNWIND keys(gender_count) as key 
    WITH CASE
      WHEN key = "male" THEN {info: year, male: gender_count[key], female: 0, unknown: 0}
      WHEN key = "female" THEN {info: year, male: 0, female: gender_count[key], unknown: 0}
      ELSE {info: year, male: 0, female: 0, unknown: gender_count[key]}
      END as List
    WITH List UNWIND List as item
    WITH {
      info: item.info,
      female:apoc.coll.sumLongs(apoc.coll.toSet(apoc.coll.flatten(collect(item.female)))),
      male:apoc.coll.sumLongs(apoc.coll.toSet(apoc.coll.flatten(collect(item.male)))),
      unknown:apoc.coll.sumLongs(apoc.coll.toSet(apoc.coll.flatten(collect(item.unknown))))
    } as item2 ORDER BY item2.info
    RETURN item2 as List
      `
        session2b.run(query2b).then((results) => {
          const genderListInit = results.records.map((record) => record.get('List', 'Activity'));
          const genderListInitA = genderListInit.filter(d => (d.info >= 1550 && d.info <= 1950))
          const genderListFilter1 = genderListInitA.filter((o, i) => !i || o.female >= (genderListInitA[i - 1].female * .25));
          const genderListFilter2 = genderListFilter1.filter((o, i) => !i || o.female >= (genderListFilter1[i - 1].female * .25));
          const genderListFilter3 = genderListFilter2.filter((o, i) => !i || o.male >= (genderListFilter2[i - 1].male * .25));
          const genderList = genderListFilter3.filter((o, i) => !i || o.male >= (genderListFilter3[i - 1].male * .25));
          this.setState({ genderList })
          session2b.close()
        })

        //FETCH NATIONALITY
        const session3 = this.driver.session();
        const query3 = `MATCH (n) WHERE id(n)=` + nodeIdFilter + `
    CALL {
      WITH n
      MATCH (n)--(t)--(p:Person) WHERE t:Event or t:Institution AND p.nationality <> "Unknown"
      RETURN DISTINCT p
    }
    WITH p.nationality AS nationality, count(*) AS count
    RETURN DISTINCT {info: nationality, count: count} AS List ORDER BY List.count`
        session3.run(query3).then((results) => {
          const nationalityList = results.records.map((record) => record.get('List', 'info'));
          const nationality = nationalityList.filter(d => d.count >= 1)
          this.setState({ nationality })
          session3.close()
        })

        //FETCH NATIONALITY (NULL)
        const session4 = this.driver.session();
        const query4 = `MATCH (n) WHERE id(n)=` + nodeIdFilter + `
    CALL {
        WITH n
        MATCH (n)--(t)--(p:Person) WHERE t:Event or t:Institution AND p.nationality IS NULL OR p.nationality = "Unknown"
        RETURN DISTINCT p
    }
    RETURN count(p) as Count`
        session4.run(query4).then((results) => {
          const nationalityNull = results.records.map((record) => record.get('Count', 'info'));
          this.setState({ nationalityNull })
          session4.close()
        })

        // FETCH GEO-INSTITUTITONAL ACTIVITY
        const session7 = this.driver.session();
        const query7 = `MATCH (g) WHERE id(g)=` + nodeIdFilter + `
    CALL {
        WITH g
        MATCH (g)--(i:Institution)-[t]-(p:Person) 
        WITH p, COLLECT(DISTINCT t.start_year) as starts, COLLECT(DISTINCT t.end_year) as ends
        WITH p, starts+ends as years UNWIND years as yearlist
        RETURN p, min(yearlist) as min, max(yearlist) as max
    }
    WITH g, p, min, max
    MATCH (g)--(i:Institution)-[t]-(p:Person)-[r]-(c:CorporateEntity) 
        WHERE (t.start_year >= min AND r.start_year >= min AND t.end_year <= max AND r.end_year <= max) 
        OR (t.start_year >= min AND r.start_year >= min AND t.end_year IS NULL AND r.end_year IS NULL)
        RETURN DISTINCT {key : c.name_western, value: count(DISTINCT i)} AS List
        ORDER BY List.count DESC LIMIT 25`
        session7.run(query7).then((results) => {
          const provinces = results.records.map((record) => record.get('List', 'count'));
          this.setState({ provinces })
          session7.close()
        })

        // FETCH GEO-PERSON ACTIVITY
        const session6 = this.driver.session();
        const query6 = `MATCH (g) WHERE id(g)=` + nodeIdFilter + `
    CALL {
        WITH g
        MATCH (g)--(i:Institution)-[t]-(p:Person) 
        WITH p, COLLECT(DISTINCT t.start_year) as starts, COLLECT(DISTINCT t.end_year) as ends
        WITH p, starts+ends as years UNWIND years as yearlist
        RETURN p, min(yearlist) as min, max(yearlist) as max
    }
    WITH g, p, min, max
    MATCH (g)--(i:Institution)-[t]-(p:Person)-[r]-(c:CorporateEntity) 
        WHERE (t.start_year >= min AND r.start_year >= min AND t.end_year <= max AND r.end_year <= max) 
        OR (t.start_year >= min AND r.start_year >= min AND t.end_year IS NULL AND r.end_year IS NULL)
        RETURN DISTINCT {key : c.name_western, value: count(DISTINCT p)} AS List
        ORDER BY List.count DESC LIMIT 25`
        session6.run(query6).then((results) => {
          const counties = results.records.map((record) => record.get('List', 'count'));
          this.setState({ counties })
          session6.close()
        })

        //FETCH INSTITUTIONS BY YEAR
        const session8 = this.driver.session();
        const query8 = `
    MATCH (p) WHERE id(p)=`+ nodeIdFilter + `
    CALL {
      WITH p
      MATCH (p)--(i:Institution)-[t]-(q:Person) WHERE t.start_year IS NOT NULL
      WITH DISTINCT i, t.start_year as min, CASE WHEN t.end_year IS NOT NULL THEN t.end_year ELSE t.start_year END as max
      RETURN i.name_western as name, range(toInteger(min), toInteger(max)) as years
      }
    WITH name, apoc.coll.flatten(collect(years)) as year_list
    UNWIND year_list as all_years
    RETURN {info: toInteger(all_years), count: toInteger(count(name))} as List  ORDER BY List.info`
        session8.run(query8).then((results) => {
          const instList = results.records.map((record) => record.get('List', 'info'));
          const filteredInstList = instList.filter(d => (d.count > 0 && d.info >= 1550 && d.info <= 1950))
          const instDateList1 = filteredInstList.filter((o, i) => !i || o.count > (filteredInstList[i - 1].count * .25));
          const instDateList2 = instDateList1.filter((o, i) => !i || o.count > (instDateList1[i - 1].count * .25));
          const instDateList3 = instDateList2.filter((o, i) => !i || o.count > (instDateList2[i - 1].count * .25));
          const instDateList = instDateList3.filter((o, i) => !i || o.count > (instDateList3[i - 1].count * .25));
          this.setState({ instDateList })
          session8.close()
        })

        //FETCH INSTITUTIONS TYPES
        const session9 = this.driver.session();
        const query9 = `MATCH (n) WHERE id(n)=` + nodeIdFilter + `
        CALL {
          WITH n
          MATCH (n)--(i:Institution)
          RETURN DISTINCT i
      }
      WITH CASE i.institution_category
        WHEN NULL THEN "N/A" 
        ELSE i.institution_category END AS type, count(*) AS count
      RETURN DISTINCT {type: type, count: count} AS List`
        session9.run(query9).then((results) => {
          const instArray = results.records.map((record) => record.get('List', 'type'));
          let instTypeList = [];
          for (let i = 0; i < instArray.length; i++) {
            this.renameProperty(instArray[i], 'type', 'key')
            this.renameProperty(instArray[i], 'count', 'value')
            { instTypeList.push(instArray[i]) }
          }
          this.setState({ instTypeList });
          session9.close()
        })
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
};

