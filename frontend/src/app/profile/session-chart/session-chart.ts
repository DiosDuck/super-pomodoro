import { Component, OnInit } from "@angular/core";
import { ChartRow, TEST_CHART_ROW_LIST } from "../profile.models";
import { DatePipe } from "@angular/common";

@Component({
    selector: 'app-profile-session-chart',
    templateUrl: 'session-chart.html',
    styleUrl: 'session-chart.scss',
    imports: [DatePipe],
})
export class SessionChart implements OnInit {
    chartListResponse = TEST_CHART_ROW_LIST;
    chartList : ChartRow[] = [];
    maxHeight : number = 0;

    ngOnInit(): void {
        this.formatChartResponse();
        this.maxHeight = this.getMaxFromList();
    }

    private getMaxFromList(): number
    {
        let max = 0;
        for (let value of this.chartList) {
            if (value.heigth > max) {
                max = value.heigth;
            }
        }

        return max;
    }

    private formatChartResponse() : void
    {
        this.chartList = this.chartListResponse.map<ChartRow>(value => {
            return {
                heigth: value.heigth / 60,
                text: value.text,
                date: new Date(value.timestamp),
            }
        });
    }
}