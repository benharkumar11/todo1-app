import React from "react";
import DeleteIcon from "@mui/icons-material/Delete"

const BulkActions = ({onDelete}) => {
    return (
        <button onClick={onDelete} style={{background: "red", border: "none", cursor: "pointer"}}>
            <DeleteIcon style={{color: "white", fontSize: "24px" }} />
        </button>
    )
}

export default BulkActions