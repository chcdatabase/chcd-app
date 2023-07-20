/////////////////////////////////////////////////////////////////////////////////////////////////////
// IMPORTS //////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
import React from 'react';
import { Row, Col, Spinner, Card } from 'react-bootstrap';
import translate from "../../Assets/indexes/translate.json"
import TotalCount from "./Visualizations/TotalCount.js";
import PieChart from "./Visualizations/PieChart.js";
import ExpandList from "./Visualizations/ExpandList.js"
import SwitchablePieChart from "./Visualizations/SwitchablePieChart.js";
import BarGraph from "./Visualizations/BarGraph.js";
import LineGraph from "./Visualizations/LineGraph.js";
import LineGraphGender from "./Visualizations/LineGraphGender.js";
import { FaLink, FaQuoteRight, FaRegWindowRestore } from 'react-icons/fa'
import ReactTooltip from "react-tooltip"
import { useAlert } from 'react-alert'



/////////////////////////////////////////////////////////////////////////////////////////////////////
// COMPONENT ////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

function DataResults(props) {

  const alert = useAlert()

  let containerCheck;
  if (props.filterDisplay == "filter_data_container") {containerCheck = "data_container"}
  else {containerCheck = "data_container_full"};

  // TOP LEVEL COUNT CREATOR
  function counterReturner(props) {
    let people;
    let corps;
    let events;
    let insts;
    if (props.totalPeople[0] !== 0) { people = <TotalCount type={translate[0]["people"][props.language]} queryResult={props.totalPeople} language={props.language}/>} else {}
    if (props.totalInstitutions[0] !== 0) { insts = <TotalCount type={translate[0]["institutions"][props.language]} queryResult={props.totalInstitutions} language={props.language}/>} else {}
    if (props.totalCorporateEntities[0] !== 0) { corps = <TotalCount type={translate[0]["corporate_entities"][props.language]} queryResult={props.totalCorporateEntities} language={props.language}/>} else {}
    if (props.totalEvents[0] !== 0) { events = <TotalCount type={translate[0]["events"][props.language]} queryResult={props.totalEvents} language={props.language}/>} else {}
    return (
      <Row className="d-flex flex-wrap flex-row justify-content-center mb-3 w-100">
          <Col>
            <div className="d-flex flex-wrap flex-row justify-content-center">
              {people}
              {insts}
              {corps}
              {events}
            </div>
          </Col>
        </Row>
    )
  }

  //TRANSLATIONS FOR TITLES
  let titletrans = {
    all_people_gender: {en: "All People by Gender", zh: "所有人（按性别）", tw: "所有人（按性別）"},
    total_nodes_rel_fam: {en: "Total Nodes by Religious Family", zh: "按宗教家族划分的总节点数", tw: "按宗教家族劃分的總節點數"},
    total_nodes_christ_trad: {en: "Total Nodes by Christian Tradition", zh: "基督教传统的总节点", tw: "基督教傳統的總節點"},
    all_people_nationality_50: {en: "All People by Nationalities with More than Fifty People", zh: "五十人以上各民族的所有人", tw: "五十人以上各民族的所有人"},
    area_activity: {en: "Highest Areas of Activity by Modern Administrative Division", zh: "现代行政区划的最高活动领域", tw: "現代行政區劃的最高活動領域"},
    aff_people_gender_year: {en: "Affiliated People by Gender and Year", zh: "按性别和年份划分的附属人员", tw: "按性別和年份劃分的附屬人員"},
    aff_people_gender: {en: "Affiliated People by Gender", zh: "按性别划分的附属人员", tw: "按性別劃分的附屬人員"},
    aff_people_nationality: {en: "Affiliated People by Nationality", zh: "按国籍划分的关联人", tw: "按國籍劃分的關聯人"},
    aff_inst_year: {en: "Affiliated Institutions by Year", zh: "附属机构（按年份）", tw: "附屬機構（按年份）"},
    aff_inst_type: {en: "Affiliated Institutions by Type", zh: "按类型划分的附属机构", tw: "按類型劃分的附屬機構"},
    aff_people_rel_fam: {en: "Affiliated People by Religious Family", zh: "按宗教家庭划分的附属人员", tw: "按宗教家庭劃分的附屬人員"},
    aff_people_christ_trad: {en: "Affiliated People by Christian Tradition", zh: "基督教传统的附属人士", tw: "基督教傳統的附屬人士"},
    aff_corp_by_inst: {en: "Corporate Entities by Institution Count", zh: "按機構數量劃分的法人實體", tw: "按机构数量划分的法人实体"},
    aff_corp_by_pop: {en: "Corporate Entities by Population", zh: "按人口划分的法人实体", tw: "按人口劃分的法人實體"},
    footnote: {
      en: "Due to the complexity of the CHCD dataset and the particularities of the different historical entities, these graphs are only general and suggestive in their content. For more accurate studies, it would always best to download the data and create more customized queries.",
      zh: "由于 CHCD 数据集的复杂性和不同历史实体的特殊性，这些图表在内容上仅具有一般性和启发性。 为了进行更准确的研究，最好总是下载数据并创建更多定制的查询。",
      tw: "由於 CHCD 數據集的複雜性和不同歷史實體的特殊性，這些圖表在內容上僅具有一般性和啟發性。 為了進行更準確的研究，最好總是下載數據並創建更多定制的查詢。"
    }
  }

  // TITLE CHECK
  function transNodeTitle(props) {
    if (props.language) {
      let tester = props.language
      if (tester === 'en' && props.nodeArray.properties.name_western) {return props.nodeArray.properties.name_western +"*" }
      if (tester === 'en' && props.nodeArray.properties.name_wes) {return props.nodeArray.properties.name_wes +"*"}
      if (tester !== 'en' && props.nodeArray.properties.chinese_name_hanzi) {return props.nodeArray.properties.chinese_name_hanzi +"*"}
      if (tester !== 'en' && props.nodeArray.properties.name_zh) {return props.nodeArray.properties.name_zh +"*"}
      else { return props.nodeArray.properties.name_western }
    } else {}
    
  }

  //LINK CONSTRUCTOR
  function buttonConstructors(props) {
    return (
      <div className=" pb-3 d-flex justify-content-center">
        <FaLink 
          className="mx-1 pb-1 link-icons" 
          data-tip data-for="permalink"
          onClick={() => { 
            const message = translate[0]["permalink_copied"][props.language];
            navigator.clipboard.writeText(window.location.href);
            alert.show(message);
          }}
          />
        <ReactTooltip id="permalink" place="bottom" effect="solid">{translate[0]["permalink"][props.language]}</ReactTooltip>
        <FaQuoteRight 
          className="mx-1 pb-1 link-icons" 
          data-tip data-for="cite"
          onClick={() => { 
            const link = window.location.href;
            let title;
              if (props.nodeArray.length === 0) {title = "Descriptive Data for the CHCD"}
              else {title = translate[0]["descriptive_data"][props.language]+': '+transNodeTitle(props)}
            const message = props.getCitation(title, link);
            const header = translate[0]["citation"][props.language]
            alert.show(message, { closeCopy: 'X', title: header });
          }}
          />
        <ReactTooltip id="cite" place="bottom" effect="solid">{translate[0]["citation"][props.language]}</ReactTooltip>
        <FaRegWindowRestore 
          className="mx-1 pb-1 link-icons" 
          data-tip data-for="popup"
          onClick={() => props.selectSwitchInitial((props.node_id))}
          />
        <ReactTooltip id="popup" place="bottom" effect="solid">{translate[0]["more_info"][props.language]}</ReactTooltip>
      </div>
    )
  }

// RETURNS //////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

  // INITIAL ALL DATABASE RETURN ///////////////////////////////////////////////////////////////////////////
  if (props.nodeArray.length === 0 || props.selectedOption === "All") { return (
    <div className={containerCheck + " bg-light px-5 py-3 data_container" } >
      <div style={{margin: 'auto auto'}}>
        <Row className="w-100">
          <Col className="d-flex justify-content-center my-3 h3">
            <span>{translate[0]["descriptive_data_chcd"][props.language]}*</span>
          </Col>
        </Row>
          {/* Total Counts */}
        <Row className="d-flex flex-wrap flex-row justify-content-center mb-3 w-100"> 
          <Col>
          <div className="d-flex flex-wrap flex-row justify-content-center">
              <TotalCount type={translate[0]["nodes"][props.language]} queryResult={props.totalNodes} language={props.language}/>
              <TotalCount type={translate[0]["relationships"][props.language]} queryResult={props.totalRelationships} language={props.language}/>
              <TotalCount type={translate[0]["people"][props.language]} queryResult={props.totalPeople} language={props.language}/>
              <TotalCount type={translate[0]["institutions"][props.language]} queryResult={props.totalInstitutions} language={props.language}/>
              <TotalCount type={translate[0]["events"][props.language]} queryResult={props.totalEvents} language={props.language}/>
              <TotalCount type={translate[0]["corporate_entities"][props.language]} queryResult={props.totalCorporateEntities} language={props.language}/>
          </div>
          </Col>
        </Row>
        <Row className="d-flex flex-wrap flex-row justify-content-center mb-3 w-100 h-100">
          {/* Gender PieChart */}
          <Col className="mb-3">
            {props.genders
            ? <div className="h-100">
                { props.genders && (
                    <PieChart title={titletrans.all_people_gender[props.language]} queryResult={props.genders} />
                )}
            </div>
            : <Card className="d-flex h-100 justify-content-center" style={{minHeight: '400px'}}>
                <Spinner className="d-flex m-auto jsutify-content-center" animation="border" role="status" variant="danger">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </Card>
            }
          </Col>
          {/* Religious Family & Christian Tradition PieChart */}
          <Col className="mb-3">
          {props.religiousFamily
            ? <div className="h-100">
                {(props.christianTradition && props.religiousFamily) && (
                    <SwitchablePieChart
                        title1={titletrans.total_nodes_christ_trad[props.language]}
                        title2={titletrans.total_nodes_rel_fam[props.language]}
                        queryResult1={props.religiousFamily}
                        queryResult1NullValues={props.religiousFamilyNullValues}
                        queryResult2={props.christianTradition}
                        queryResult2NullValues={props.christianTraditionNullValues} />
                )}
              </div>
            : <Card className="d-flex h-100 justify-content-center" style={{minHeight: '400px'}}>
                <Spinner className="d-flex m-auto jsutify-content-center" animation="border" role="status" variant="danger">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </Card>
            }
          </Col>
        </Row>
        <Row className="d-flex flex-wrap flex-row justify-content-center mb-3 w-100">
          {/* Nationality Bar Graph */}
          <Col className="mb-3">
          {props.nationality
            ? <div className="h-100">
                { props.nationality && (
                    <BarGraph title={titletrans.all_people_nationality_50[props.language]}
                    queryResult={props.nationality}
                    queryResultNationalityNull={props.nationalityNull}
                    />
                )}
              </div>
            : <Card className="d-flex h-100 justify-content-center" style={{minHeight: '400px'}}>
                <Spinner className="d-flex m-auto jsutify-content-center" animation="border" role="status" variant="danger">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </Card>
            }
          </Col>
          {/* Areas of Activity List */}
          <Col className="mb-3">
          {props.provinces
            ? <div className="h-100">
                {props.provinces && (
                  <ExpandList title={titletrans.area_activity[props.language]}
                  queryResult={[props.provinces, props.prefectures, props.counties]}
                  />
                )}
              </div>
            : <Card className="d-flex h-100 justify-content-center" style={{minHeight: '400px'}}>
                <Spinner className="d-flex m-auto jsutify-content-center" animation="border" role="status" variant="danger">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </Card>
            }
          </Col>
        </Row>
        <Row className="text-center  pb-2 px-5">
          <Col>
            <div>* {titletrans.footnote[props.language]}</div>
          </Col>
        </Row>
      </div>
    </div>
  )}

  // CORP DATA RETURN //////////////////////////////////////////////////////////////////////////////////////
  else if (props.nodeArray.labels[0] === "CorporateEntity") {  return ( 
    <div className={containerCheck + " bg-light px-5 py-3 data_container" }>
      <div style={{margin: 'auto auto'}}>
      <h1 className="aria-only">{translate[0]["search"][props.language]}</h1>
        <Row className="w-100">
          <Col className="d-flex justify-content-center my-3 h3">
            <span>{translate[0]["descriptive_data"][props.language]}: {transNodeTitle(props)}</span>
          </Col></Row>
          <Row><Col>{buttonConstructors(props)}</Col></Row>
          {/* Total Counts */}
          {counterReturner(props) }
        <Row className="d-flex flex-wrap flex-row justify-content-center mb-3 w-100">
          {/* Gender Line Graph */}
          <Col className="mb-3">
            {props.genderList
            ? <div className="h-100">
              { props.genderList && (
                <LineGraphGender title={titletrans.aff_people_gender_year[props.language]}
                queryResult={props.genderList}
                />
              )}
            </div>
            : <Card className="d-flex h-100 justify-content-center" style={{minHeight: '400px'}}>
                <Spinner className="d-flex m-auto jsutify-content-center" animation="border" role="status" variant="danger">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </Card>
            }
          </Col>
          {/* Gender Pie Chart */}
          <Col className="mb-3">
            {props.genders
            ? <div className="h-100">
              { props.genders && (
                <PieChart title={titletrans.aff_people_gender[props.language]}
                queryResult={props.genders} 
                />
              )}
              </div>
            : <Card className="d-flex h-100 justify-content-center" style={{minHeight: '400px'}}>
                <Spinner className="d-flex m-auto jsutify-content-center" animation="border" role="status" variant="danger">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </Card>
            }
          </Col>
        </Row>
        <Row className="d-flex flex-wrap flex-row justify-content-center mb-3 w-100">
          {/* Nationality Bar Graph */}
          <Col className="mb-3">
            {props.nationality
            ? <div className="h-100">
              { props.nationality && (
                <BarGraph title={titletrans.aff_people_nationality[props.language]}
                queryResult={props.nationality}
                queryResultNationalityNull={props.nationalityNull}
                />
              )}
              </div>
            : <Card className="d-flex h-100 justify-content-center" style={{minHeight: '400px'}}>
                <Spinner className="d-flex m-auto jsutify-content-center" animation="border" role="status" variant="danger">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </Card>
            }
          </Col>
          {/* Areas of Activity List*/}
          <Col className="mb-3">
            {props.provinces
            ? <div className="h-100">
              { props.provinces && (
                <ExpandList title={titletrans.area_activity[props.language]}
                queryResult={[props.provinces, props.prefectures, props.counties]}
                />
              )}
              </div>
            : <Card className="d-flex h-100 justify-content-center" style={{minHeight: '400px'}}>
                <Spinner className="d-flex m-auto jsutify-content-center" animation="border" role="status" variant="danger">
                </Spinner>
                <div className="p-2 text-danger d-flex justify-content-center" style={{transform: 'translateY(-200px)'}}>
                  {translate[0]["long_load_message"][props.language]}
                </div>
              </Card>
            }
          </Col>
        </Row>
        <Row className="d-flex flex-wrap flex-row justify-content-center mb-3 w-100">
          {/* Institutions Line Graph */}
          <Col className="mb-3">
            {props.instDateList
            ? <div className="h-100">
                { props.instDateList && (
                  <LineGraph title={titletrans.aff_inst_year[props.language]}
                  queryResult={props.instDateList}
                  />
                )}
              </div>
            : <Card className="d-flex h-100 justify-content-center" style={{minHeight: '400px'}}>
                <Spinner className="d-flex m-auto jsutify-content-center" animation="border" role="status" variant="danger">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </Card>
            }
            </Col>
            {/* Institutions Type PieChart */}
            <Col className="mb-3">
            {props.instTypeList
            ? <div className="h-100">
                { props.instTypeList && (
                  <PieChart title={titletrans.aff_inst_type[props.language]} queryResult={props.instTypeList} />
                )}
              </div>
            : <Card className="d-flex h-100 justify-content-center" style={{minHeight: '400px'}}>
                <Spinner className="d-flex m-auto jsutify-content-center" animation="border" role="status" variant="danger">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </Card>
            }
            </Col>
        </Row>
        <Row className="text-center  pb-2 px-5">
          <Col>
            <div>* {titletrans.footnote[props.language]}</div>
          </Col>
        </Row>
      </div>
    </div>
  )}

  // INST DATA RETURN //////////////////////////////////////////////////////////////////////////////////////
  else if (props.nodeArray.labels[0] === "Institution") { return ( 
    <div className={containerCheck + " bg-light px-5 py-3 data_container" }>
      <div style={{margin: 'auto auto'}}>
      <h1 className="aria-only">{translate[0]["search"][props.language]}</h1>
        <Row className="w-100">
          <Col className="d-flex justify-content-center my-3 h3"><span>{translate[0]["descriptive_data"][props.language]}: {transNodeTitle(props)}</span></Col>
        </Row>
          <Row><Col>{buttonConstructors(props)}</Col></Row>
          {/* Total Counts */}
          {counterReturner(props) }
        <Row className="d-flex flex-wrap flex-row justify-content-center mb-3 w-100">
          {/* Gender Line Graph */}
          <Col className="mb-3">
            {props.genderList
            ? <div className="h-100">
              { props.genderList && (
                <LineGraphGender title={titletrans.aff_people_gender_year[props.language]}
                queryResult={props.genderList}
                />
              )}
              </div>
            : <Card className="d-flex h-100 justify-content-center" style={{minHeight: '400px'}}>
                <Spinner className="d-flex m-auto jsutify-content-center" animation="border" role="status" variant="danger">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </Card>
            }
          </Col>
          {/* Gender Pie Chart */}
          <Col className="mb-3">
            {props.genders
            ? <div className="h-100">
              { props.genders && (
                <PieChart title={titletrans.aff_people_gender[props.language]}
                queryResult={props.genders} 
                />
              )}
            </div>
            : <Card className="d-flex h-100 justify-content-center" style={{minHeight: '400px'}}>
                <Spinner className="d-flex m-auto jsutify-content-center" animation="border" role="status" variant="danger">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </Card>
            }
          </Col>
        </Row>
        <Row className="d-flex flex-wrap flex-row justify-content-center mb-3 w-100">
          {/* Nationality Bar Graph */}
          <Col className="mb-3">
            {props.nationality
            ? <div className="h-100">
              { props.nationality && (
                <BarGraph title={titletrans.aff_people_nationality[props.language]}
                queryResult={props.nationality}
                queryResultNationalityNull={props.nationalityNull}
                />
              )}
            </div>
            : <Card className="d-flex h-100 justify-content-center" style={{minHeight: '400px'}}>
                <Spinner className="d-flex m-auto jsutify-content-center" animation="border" role="status" variant="danger">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </Card>
            }
          </Col>
          {/* Religious Family & Christian Tradition Switchable Pie Chart */}
          <Col className="mb-3">
          {props.religiousFamily
            ? <div className="h-100">
              {(props.christianTradition && props.religiousFamily) && (
                <SwitchablePieChart
                    title1={titletrans.aff_people_rel_fam[props.language]}
                    title2={titletrans.aff_people_christ_trad[props.language]}
                    queryResult1={props.religiousFamily}
                    queryResult1NullValues={props.religiousFamilyNullValues}
                    queryResult2={props.christianTradition}
                    queryResult2NullValues={props.christianTraditionNullValues} />
              )}
              </div>
            : <Card className="d-flex h-100 justify-content-center" style={{minHeight: '400px'}}>
                <Spinner className="d-flex m-auto jsutify-content-center" animation="border" role="status" variant="danger">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </Card>
            }
            </Col>
        </Row>
        <Row className="text-center  pb-2 px-5">
          <Col>
            <div>* {titletrans.footnote[props.language]}</div>
          </Col>
        </Row>
      </div>
    </div>
  )}

  // GEO DATA RETURN
  else if (props.nodeArray.labels[0] === "County" || 
          props.nodeArray.labels[0] === "Prefecture" || 
          props.nodeArray.labels[0] === "Province") { return (
    <div className={containerCheck + " bg-light px-5 py-3 data_container" }>
      <div style={{margin: 'auto auto'}}>
      <h1 className="aria-only">{translate[0]["search"][props.language]}</h1>
        <Row className="w-100">
          <Col className="d-flex justify-content-center my-3 h3"><span>{translate[0]["descriptive_data"][props.language]}: {transNodeTitle(props)}</span></Col>
        </Row>
        <Row><Col>{buttonConstructors(props)}</Col></Row>
          {/* Total Counts */}
          {counterReturner(props) }
        <Row className="d-flex flex-wrap flex-row justify-content-center mb-3 w-100">
          {/* Gender Line Graph */}
          <Col className="mb-3">
            {props.genderList
            ? <div className="h-100">
              { props.genderList && (
                <LineGraphGender title={titletrans.aff_people_gender_year[props.language]}
                queryResult={props.genderList}
                />
              )}
            </div>
            : <Card className="d-flex h-100 justify-content-center" style={{minHeight: '400px'}}>
                <Spinner className="d-flex m-auto jsutify-content-center" animation="border" role="status" variant="danger">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </Card>
            }
          </Col>
          {/* Gender Pie Chart */}
          <Col className="mb-3">
            {props.genders
            ? <div className="h-100">
              <PieChart title={titletrans.aff_people_gender[props.language]} 
                queryResult={props.genders} />
              </div>
            : <Card className="d-flex h-100 justify-content-center" style={{minHeight: '400px'}}>
                <Spinner className="d-flex m-auto jsutify-content-center" animation="border" role="status" variant="danger">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </Card>
            }
          </Col>
        </Row>
        <Row className="d-flex flex-wrap flex-row justify-content-center mb-3 w-100">
          {/* Nationality Bar Graph */}
          <Col className="mb-3">
            {props.nationality
            ? <div className="h-100">
              { props.nationality && (
                <BarGraph title={titletrans.aff_people_nationality[props.language]}
                queryResult={props.nationality}
                queryResultNationalityNull={props.nationalityNull}
                />
              )}
            </div>
            : <Card className="d-flex h-100 justify-content-center" style={{minHeight: '400px'}}>
                <Spinner className="d-flex m-auto jsutify-content-center" animation="border" role="status" variant="danger">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </Card>
            }
          </Col>
          {/* Switchable Activity Count Pie Graphs */}
          <Col className="mb-3">
            {props.provinces
            ? <div className="h-100">
              {(props.provinces && props.counties) && (
                  <SwitchablePieChart
                      title1={titletrans.aff_corp_by_inst[props.language]}
                      title2={titletrans.aff_corp_by_pop[props.language]}
                      queryResult1={props.provinces}
                      queryResult2={props.counties} />
              )}
            </div>
            : <Card className="d-flex h-100 justify-content-center" style={{minHeight: '400px'}}>
                <Spinner className="d-flex m-auto jsutify-content-center" animation="border" role="status" variant="danger">
                </Spinner>
                <div className="p-2 text-danger d-flex justify-content-center" style={{transform: 'translateY(-200px)'}}>
                  {translate[0]["long_load_message"][props.language]}
                </div>
              </Card>
            }
          </Col>
        </Row>
        <Row className="d-flex flex-wrap flex-row justify-content-center mb-3 w-100">
          {/* Insitutions Line Graph */}
          <Col className="mb-3">
            {props.instDateList
            ? <div className="h-100">
                { props.instDateList && (
                  <LineGraph title={titletrans.aff_inst_year[props.language]}
                  queryResult={props.instDateList}
                  />
                )}
              </div>
            : <Card className="d-flex h-100 justify-content-center" style={{minHeight: '400px'}}>
                <Spinner className="d-flex m-auto jsutify-content-center" animation="border" role="status" variant="danger">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </Card>
            }
            </Col>
            {/* Institutions Type Pie Chart */}
            <Col className="mb-3">
            {props.instTypeList
            ? <div className="h-100">
                { props.instTypeList && (
                  <PieChart title={titletrans.aff_inst_type[props.language]} 
                    queryResult={props.instTypeList} />
                )}
              </div>
            : <Card className="d-flex h-100 justify-content-center" style={{minHeight: '400px'}}>
                <Spinner className="d-flex m-auto jsutify-content-center" animation="border" role="status" variant="danger">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </Card>
            }
            </Col>
        </Row>
        <Row className="text-center  pb-2 px-5">
          <Col>
            <div>* {titletrans.footnote[props.language]}</div>
          </Col>
        </Row>
      </div>
    </div>
  )}

  // LOADING STATE RETURN ///////////////////////////////////////////////////////////////////////////
  else { return (
    <div className="bg-light d-flex" style={{height: '60vh'}}>
      <div style={{margin: 'auto auto'}}>
        <Row><Col>
        <Spinner animation="border" role="status" variant="danger"><span className="visually-hidden hide">Loading...</span></Spinner>
        </Col></Row>
      </div>
    </div>
   )}

}

/////////////////////////////////////////////////////////////////////////////////////////////////////
// EXPORT //////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

export default DataResults
