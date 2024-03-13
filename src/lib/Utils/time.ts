import moment from "moment";

export function formatYMD(date: moment.MomentInput): string {
    return moment(date).format('YYYY/MM/DD');
}