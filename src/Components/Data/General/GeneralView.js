// IMPORTS ////////////////////////////////////////////////////////////////////
import TotalCount from './TotalCount';

// MAIN DEPENDENCIES
import React from 'react'



// FUNCTIONAL COMPONENT ////////////////////////////////////////////////////////

function GeneralView(props) {

  // RETURNS PLACEHOLDER
  return ( 
    <>
      <div className="d-flex">
        <TotalCount type="Nodes" queryResult={8832} /* PUT YOUR CUSTOM QUERY HERE */ />
        <TotalCount type="Relationships" queryResult={98} /* PUT YOUR CUSTOM QUERY HERE */ />
        <TotalCount type="People" queryResult={12489} />
      </div>
    </>
  )

}

export default GeneralView
