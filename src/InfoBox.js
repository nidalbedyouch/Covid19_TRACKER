import React from 'react';
import {Card, CardContent, Typography} from "@material-ui/core"
import './InfoBox.css'

function InfoBox({title, cases, total,active, isRed, ...props }) {
    return (
        <Card
            onClick={props.onClick}
            className={`infoBox ${active && "infoBox--selected"} ${
            isRed && "infoBox--red"
            }`}
        >
            <CardContent>
                {/* Title */}
                <Typography gutterBottom color="textSecondary" >{title}</Typography>
                {/* Number of cases  */}
                <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}>
                    {cases}
                </h2>
                {/* Total */}
                <Typography className="infoBox_total" color="textSecondary" >
                    {total} Total
                </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox;
