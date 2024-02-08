
import { patterns } from 'src/app/shared/utils/validation-patterns';
import {
    shortSubSegmentHtmlEmailTemplate,
    longSubSegmentHtmlEmailTemplate,
    mainHtmlEmailTemplate,
    contentHtmlEmailTemplate,
    reqSegmentHtmlEmailTemplate,
    subSegmentHtmlEmailTemplate,
    subSegmentSeparatorHtmlTemplate,
    hrHtmlEmailTemplate,
    htmlEmailTemplate,
    emailSentBy
} from '../utils/emails.data';

export class Email {
    private items;
    private subSegmentHtmlTemplate;
    private subject: string;
    private to: string[];
    private header: string;
    private footer: string;

    constructor(subject: string, to: string, emailItems: any[], emailType: 'short' | 'long', header: string, footer: string) {
        this.subject = subject.trim();
        this.to = to.replace(' ', '').split(',');
        this.items = emailItems;
        this.subSegmentHtmlTemplate = emailType === 'short' ? shortSubSegmentHtmlEmailTemplate : longSubSegmentHtmlEmailTemplate;
        this.header = header;
        this.footer = footer;
    }

    private buildTripsHtml(): string {
        let htmlContent = '';
        const requestsCount = this.items.length;
        this.items.forEach((request: any, idx1: number) => {
            let thisRequestHtml = contentHtmlEmailTemplate;
            thisRequestHtml = thisRequestHtml.replace('${PATH_REQUESTED_TITLE}', request.segments.bcPathRequestedTitle);
            thisRequestHtml = thisRequestHtml.replace('${PATH_REQUESTED_TOTAL_PRICE}', request.totalPrice || '');
            const reqSegmentCount = request.segments.reqSegments.length;
            let requestedSegmentsHtml = '';
            request.segments.reqSegments.forEach((reqSegment: any, idx2: number) => {
                let thisRequestedSegment = reqSegmentHtmlEmailTemplate;
                thisRequestedSegment = thisRequestedSegment.replace(
                    '${REQUESTED_SEGMENT_TITLE}',
                    request.totalPrice ? reqSegment.bcPathRequestedTitle : ''
                );
                thisRequestedSegment = thisRequestedSegment.replace('${REQUESTED_SEGMENT_DURATION}', 'Total Duration: ' + reqSegment.duration);
                let subSegmentsHtml = '';
                const subRequestsCount = reqSegment.subSegments.length;
                reqSegment.subSegments.forEach((subSegment: any, idx3: number) => {
                    let thisSubSegment = subSegmentHtmlEmailTemplate;
                    const thisSubSegmentLayout = this.subSegmentHtmlTemplate;
                    thisSubSegment = thisSubSegment.replace('${SUB_SEGMENT_LAYOUT}', thisSubSegmentLayout);
                    thisSubSegment = thisSubSegment.replace('${CMPNY}', subSegment.segmentLine.info.company.code);
                    thisSubSegment = thisSubSegment.replace('${FLIGHT}', subSegment.segmentLine.info.flightNumber);
                    thisSubSegment = thisSubSegment.replace('${DPRTRE_DATE}', subSegment.segmentLine.departure.date);
                    thisSubSegment = thisSubSegment.replace('${DPRTRE_TIME}', subSegment.segmentLine.departure.time);
                    thisSubSegment = thisSubSegment.replace('${DPRTRE_AIRPORT}', subSegment.segmentLine.departure.airport.text);
                    let departureTerminal = '';
                    if (subSegment.segmentLine.departure.terminal && subSegment.segmentLine.departure.terminal.length > 0) {
                        departureTerminal = 'Terminal ' + subSegment.segmentLine.departure.terminal;
                    }
                    thisSubSegment = thisSubSegment.replace('${DPRTRE_TERMINAL}', departureTerminal);
                    thisSubSegment = thisSubSegment.replace('${ARVL_DATE}', subSegment.segmentLine.arrival.date);
                    thisSubSegment = thisSubSegment.replace('${ARVL_TIME}', subSegment.segmentLine.arrival.time);
                    thisSubSegment = thisSubSegment.replace('${ARVL_AIRPORT}', subSegment.segmentLine.arrival.airport.text);
                    let arrivalTerminal = '';
                    if (subSegment.segmentLine.arrival.terminal && subSegment.segmentLine.arrival.terminal.length > 0) {
                        arrivalTerminal = 'Terminal ' + subSegment.segmentLine.arrival.terminal;
                    }
                    thisSubSegment = thisSubSegment.replace('${ARVL_TERMINAL}', arrivalTerminal);
                    thisSubSegment = thisSubSegment.replace('${DURATION}', subSegment.segmentLine.info.flightDuration);
                    let operatedBy = '';
                    if (
                        subSegment.segmentLine.info.operatedBy &&
                        subSegment.segmentLine.info.operatedBy.text &&
                        subSegment.segmentLine.info.operatedBy.text.length > 0
                    ) {
                        operatedBy = 'Operated by: ' + subSegment.segmentLine.info.operatedBy.text;
                        operatedBy += '<br/>';
                    }
                    thisSubSegment = thisSubSegment.replace('${OPERATED_BY}', operatedBy);
                    thisSubSegment = thisSubSegment.replace('${AIRCRAFT}', subSegment.segmentLine.info.airplane.text);
                    let cabin = '';
                    if (subSegment.segmentLine.info.cabin && subSegment.segmentLine.info.cabin.length > 0) {
                        cabin = '<br/>';
                        cabin += 'Cabin/Class: ' + subSegment.segmentLine.info.cabin;
                    }
                    thisSubSegment = thisSubSegment.replace('${CABIN_CLASS}', cabin);
                    let bag = '';
                    if (subSegment.segmentLine.info.bagInfo && subSegment.segmentLine.info.bagInfo.length > 0) {
                        const baggage = subSegment.segmentLine.info.bagInfo.replace('K', ' Kg').replace('PC', ' Bag(s)').replace('Lbs', ' Lbs');
                        bag = 'Baggage: ' + baggage;
                    }
                    thisSubSegment = thisSubSegment.replace('${BAG_INFO}', bag);
                    if (idx3 < subRequestsCount - 1) {
                        thisSubSegment += subSegmentSeparatorHtmlTemplate;
                    }
                    subSegmentsHtml += thisSubSegment;
                });

                thisRequestedSegment = thisRequestedSegment.replace('${TRIP_BODY}', subSegmentsHtml);
                requestedSegmentsHtml += thisRequestedSegment;

                if (idx2 < reqSegmentCount - 1) {
                    requestedSegmentsHtml += subSegmentSeparatorHtmlTemplate;
                }
            });
            thisRequestHtml = thisRequestHtml.replace('${REQUESTED_SEGMENTS}', requestedSegmentsHtml);
            let hrToReplace = '';
            if (idx1 < requestsCount - 1) {
                hrToReplace = hrHtmlEmailTemplate;
            }
            thisRequestHtml = thisRequestHtml.replace('${HR}', hrToReplace);
            htmlContent += thisRequestHtml;
        });
        return htmlContent;
    }

    getEmailHtmlContent(): string {
        let output = mainHtmlEmailTemplate;
        output = output.replace('${EMAIL_BODY}', htmlEmailTemplate);
        output = output.replace('${CONTENT}', this.buildTripsHtml());
        output = output.replace('${HEADER}', this.header);
        output = output.replace('${FOOTER}', this.footer);
        output = output.replace('${SENT_BY}', emailSentBy);
        output = output.replace('${SUBJECT_OR_TEMPLATE_NAME}', this.subject);
        return output;
    }

    get toEmail(): string[] {
        return this.to;
    }

    get emailSubject(): string {
        return this.subject;
    }

    get isValid(): boolean {
        let areToEmailsValid = true;
        this.to.forEach((email) => {
            areToEmailsValid = areToEmailsValid && patterns.email.test(email);
        });
        return this.to.length > 0 && areToEmailsValid && this.subject.length > 0;
    }
}
