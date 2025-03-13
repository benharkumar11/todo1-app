import React from "react";

const Filters = () => {
    return(
        <div className="filter-container">
            <select className="filter-dropdown">
                <option value="">ALL</option>
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
            </select>

            <select className="filter-dropdown">
                <option value="">ALL</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
            </select>
        </div>
    )
}

export default Filters