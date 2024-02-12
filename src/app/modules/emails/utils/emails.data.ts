export const htmlEmailTemplate =
  '<!-- GRAY SPACE ABOVE HEADER -->' +
  '<div class="block">' +
  '<table bgcolor="#f6f4f5" border="0" cellpadding="0" cellspacing="0" width="100%">' +
  '<tbody>' +
  '<tr>' +
  '<td>' +
  '<table align="center" bgcolor="#f6f4f5" border="0" cellpadding="0" cellspacing="0" class="devicewidth" width="580">' +
  '<tbody>' +
  '<tr>' +
  '<td>' +
  '<table align="center" border="0" cellpadding="0" cellspacing="0" class="devicewidthinner" width="540">' +
  '<tbody>' +
  '<!-- Spacing -->' +
  '<tr>' +
  '<td width="540" height="20" style="font-size:1px; line-height:1px; mso-line-height-rule: exactly;width: 540px!important;">&nbsp;</td>' +
  '</tr>' +
  '</tbody>' +
  '</table>' +
  '</td>' +
  '</tr>' +
  '</tbody>' +
  '</table>' +
  '</td>' +
  '</tr>' +
  '</tbody>' +
  '</table>' +
  '</div>' +
  '<!-- HEADER -->' +
  '<div class="block">' +
  '<table bgcolor="#f6f4f5" border="0" cellpadding="0" cellspacing="0" width="100%">' +
  '<tbody>' +
  '<tr>' +
  '<td>' +
  '<table align="center" bgcolor="#ffffff" border="0" cellpadding="0" cellspacing="0" class="devicewidth" width="580">' +
  '<tbody>' +
  '<tr>' +
  '<td height="40" style ="background-color: rgb(0, 120, 174);">' +
  '<table align="center" border="0" cellpadding="0" cellspacing="0" class="devicewidthinner" width="540">' +
  '<tbody>' +
  '<!-- Spacing -->' +
  '<tr>' +
  // tslint:disable-next-line: max-line-length
  '<td height="40" width: 540px!important;" style="font-family: Helvetica, arial, sans-serif; font-size: 18px; text-align:left; color: white;">' +
  '${SUBJECT_OR_TEMPLATE_NAME}' +
  '</td>' +
  '</tr>' +
  '</tbody>' +
  '</table>' +
  '</td>' +
  '</tr>' +
  '</tbody>' +
  '</table>' +
  '</td>' +
  '</tr>' +
  '<tr>' +
  '<td>' +
  '<table align="center" bgcolor="#ffffff" border="0" cellpadding="0" cellspacing="0" class="devicewidth" width="580">' +
  '<tbody>' +
  '<tr>' +
  '<td>' +
  '<table align="center" border="0" cellpadding="0" cellspacing="0" class="devicewidthinner" width="540">' +
  '<tbody>' +
  '<!-- Spacing -->' +
  '<tr>' +
  '<td height="20" width="100%">&nbsp;</td>' +
  '</tr>' +
  '<!-- end of spacing -->' +
  '<!-- Content -->' +
  '<tr>' +
  '<td style="font-family: Helvetica, arial, sans-serif; font-size: 14px; color: #666; text-align:left;line-height: 24px;">${HEADER}</td>' +
  '</tr>' +
  '<!-- end of content -->' +
  '<!-- Spacing -->' +
  '<tr>' +
  '<td height="40" width="100%">&nbsp;</td>' +
  '</tr>' +
  '<!-- end of spacing -->' +
  '</tbody>' +
  '</table>' +
  '</td>' +
  '</tr>' +
  '</tbody>' +
  '</table>' +
  '</td>' +
  '</tr>' +
  '</tbody>' +
  '</table>' +
  '</div>' +
  '${CONTENT}' +
  '<!-- FOOTER -->' +
  '<div class="block">' +
  '<!-- image + text -->' +
  '<table bgcolor="#f6f4f5" border="0" cellpadding="0" cellspacing="0" width="100%">' +
  '<tbody>' +
  '<tr>' +
  '<td>' +
  '<table align="center" bgcolor="#ffffff" border="0" cellpadding="0" cellspacing="0" class="devicewidth" width="580">' +
  '<tbody>' +
  '<tr>' +
  '<td>' +
  '<table align="center" border="0" cellpadding="0" cellspacing="0" class="devicewidthinner" width="540">' +
  '<tbody>' +
  '<!-- Spacing -->' +
  '<tr>' +
  '<td height="20" width="100%">&nbsp;</td>' +
  '</tr>' +
  '<!-- end of spacing -->' +
  '<!-- Content -->' +
  '<tr>' +
  '<td style="font-family: Helvetica, arial, sans-serif; font-size: 14px; color: #666; text-align:left;line-height: 24px;">${FOOTER}</td>' +
  '</tr>' +
  '<!-- end of content -->' +
  '<!-- Spacing -->' +
  '<tr>' +
  '<td height="20" width="100%">&nbsp;</td>' +
  '</tr>' +
  '<!-- end of spacing -->' +
  '</tbody>' +
  '</table>' +
  '</td>' +
  '</tr>' +
  '</tbody>' +
  '</table>' +
  '</td>' +
  '</tr>' +
  '</tbody>' +
  '</table>' +
  '</div>' +
  '<!-- SENT BY... -->' +
  '<div class="block">' +
  '<!-- image + text -->' +
  '<table bgcolor="#f6f4f5" border="0" cellpadding="0" cellspacing="0" width="100%">' +
  '<tbody>' +
  '<tr>' +
  '<td>' +
  '<table align="center" bgcolor="#f6f4f5" border="0" cellpadding="0" cellspacing="0" class="devicewidth" width="580">' +
  '<tbody>' +
  '<tr>' +
  '<td>' +
  '<table align="center" border="0" cellpadding="0" cellspacing="0" class="devicewidthinner" width="540">' +
  '<tbody>' +
  '<!-- Spacing -->' +
  '<tr>' +
  '<td height="30" width="100%">&nbsp;</td>' +
  '</tr>' +
  '<!-- end of spacing -->' +
  '<!-- Content -->' +
  '<tr>' +
  // tslint:disable-next-line: max-line-length
  '<td style="font-family: Helvetica, arial, sans-serif; font-size: 10px; color: rgb(153,153,153); text-align:left;line-height: 24px;">${SENT_BY}</td>' +
  '</tr>' +
  '<!-- end of content -->' +
  '<!-- Spacing -->' +
  '<tr>' +
  '<td height="20" width="100%">&nbsp;</td>' +
  '</tr>' +
  '<!-- end of spacing -->' +
  '</tbody>' +
  '</table>' +
  '</td>' +
  '</tr>' +
  '</tbody>' +
  '</table>' +
  '</td>' +
  '</tr>' +
  '</tbody>' +
  '</table>' +
  '</div>' +
  '<!-- GRAY SPACE UNDER FOOTER -->' +
  '<div class="block">' +
  '<table bgcolor="#f6f4f5" border="0" cellpadding="0" cellspacing="0" width="100%">' +
  '<tbody>' +
  '<tr>' +
  '<td>' +
  '<table align="center" bgcolor="#f6f4f5" border="0" cellpadding="0" cellspacing="0" class="devicewidth" width="580">' +
  '<tbody>' +
  '<tr>' +
  '<td>' +
  '<table align="center" border="0" cellpadding="0" cellspacing="0" class="devicewidthinner" width="540">' +
  '<tbody>' +
  '<!-- Spacing -->' +
  '<tr>' +
  '<td width="540" height="20" style="font-size:1px; line-height:1px; mso-line-height-rule: exactly;width: 540px!important;">&nbsp;</td>' +
  '</tr>' +
  '</tbody>' +
  '</table>' +
  '</td>' +
  '</tr>' +
  '</tbody>' +
  '</table>' +
  '</td>' +
  '</tr>' +
  '</tbody>' +
  '</table>' +
  '</div>';

export const contentHtmlEmailTemplate =
  '<!-- TRIP CONTENT (header + 4 columns) -->' +
  '<div class="block">' +
  '<table width="100%" bgcolor="#f6f4f5" cellpadding="0" cellspacing="0" border="0" id="backgroundTable" st-sortable="3columns">' +
  '<tbody>' +
  '<tr>' +
  '<td>' +
  '<table bgcolor="#ffffff" width="580" cellpadding="0" cellspacing="0" border="0" align="center" class="devicewidth" modulebg="edit">' +
  '<tbody>' +
  '<tr>' +
  '<td width="100%" height="1"></td>' +
  '</tr>' +
  '<tr>' +
  '<td>' +
  '<table width="540" cellpadding="0" cellspacing="0" border="0" align="center" class="devicewidth">' +
  '<tbody>' +
  '<tr>' +
  '<td>' +
  '<!-- col 1 -->' +
  '<table width="426" align="left" border="0" cellpadding="0" cellspacing="0" class="devicewidth">' +
  '<tbody>' +
  '<tr>' +
  '<td>' +
  '<!-- start of text content table -->' +
  '<table width="426" align="center" border="0" cellpadding="0" cellspacing="0" class="devicewidthinner">' +
  '<tbody>' +
  '<!-- content2 -->' +
  '<tr>' +
  // tslint:disable-next-line: max-line-length
  '<td style="font-family: Helvetica, arial, sans-serif; font-size: 16px; color: #666; text-align:left;line-height: 20px;" st-content="3col-para1">${PATH_REQUESTED_TITLE}</td>' +
  '</tr>' +
  '</tbody>' +
  '</table>' +
  '</td>' +
  '</tr>' +
  '<!-- end of text content table -->' +
  '</tbody>' +
  '</table>' +
  '<!-- col 2 -->' +
  '<table width="100" align="right" border="0" cellpadding="0" cellspacing="0" class="devicewidth">' +
  '<tbody>' +
  '<tr>' +
  '<td>' +
  '<!-- start of text content table -->' +
  '<table width="100" align="center" border="0" cellpadding="0" cellspacing="0" class="devicewidthinner">' +
  '<tbody>' +
  '<!-- content2 -->' +
  '<tr>' +
  // tslint:disable-next-line: max-line-length
  '<td style="font-family: Helvetica, arial, sans-serif; font-size: 16px; color: #666; text-align:right;line-height: 20px;" st-content="3col-para2">${PATH_REQUESTED_TOTAL_PRICE}</td>' +
  '</tr>' +
  '</tbody>' +
  '</table>' +
  '</td>' +
  '<td width="5"></td>' +
  '</tr>' +
  '<!-- end of text content table -->' +
  '</tbody>' +
  '</table>' +
  '<!-- end of col 2 -->' +
  '</td>' +
  '</tr>' +
  '${REQUESTED_SEGMENTS}' +
  '${HR}' +
  '</tbody>' +
  '</table>' +
  '</td>' +
  '</tr>' +
  '<tr>' +
  '<td width="100%" height="20"></td>' +
  '</tr>' +
  '</tbody>' +
  '</table>' +
  '</td>' +
  '</tr>' +
  '</tbody>' +
  '</table>' +
  '<!-- end of 4-columns -->' +
  '</div>';

export const reqSegmentHtmlEmailTemplate =
  '<!-- TRIP TITLE -->' +
  '<tr>' +
  '<td>' +
  '<!-- col 1 -->' +
  '<table width="406" align="left" border="0" cellpadding="0" cellspacing="0" class="devicewidth">' +
  '<tbody>' +
  '<tr>' +
  '<td>' +
  '<!-- start of text content table -->' +
  '<table width="406" align="center" border="0" cellpadding="0" cellspacing="0" class="devicewidthinner">' +
  '<tbody>' +
  '<!-- content2 -->' +
  '<tr>' +
  // tslint:disable-next-line: max-line-length
  '<td style="font-family: Helvetica, arial, sans-serif; font-size: 12px; color: #666; text-align:left;line-height: 20px;" st-content="3col-para1"><strong>${REQUESTED_SEGMENT_TITLE}</strong></td>' +
  '</tr>' +
  '</tbody>' +
  '</table>' +
  '</td>' +
  '</tr>' +
  '<!-- end of text content table -->' +
  '</tbody>' +
  '</table>' +
  '<!-- col 2 -->' +
  '<table width="120" align="right" border="0" cellpadding="0" cellspacing="0" class="devicewidth">' +
  '<tbody>' +
  '<tr>' +
  '<td>' +
  '<!-- start of text content table -->' +
  '<table width="120" align="center" border="0" cellpadding="0" cellspacing="0" class="devicewidthinner">' +
  '<tbody>' +
  '<!-- content2 -->' +
  '<tr>' +
  // tslint:disable-next-line: max-line-length
  '<td style="font-family: Helvetica, arial, sans-serif; font-size: 12px; color: #666; text-align:right;line-height: 20px;" st-content="3col-para2"><strong>${REQUESTED_SEGMENT_DURATION}</strong></td>' +
  '</tr>' +
  '</tbody>' +
  '</table>' +
  '</td>' +
  '<td width="5"></td>' +
  '</tr>' +
  '<!-- end of text content table -->' +
  '</tbody>' +
  '</table>' +
  '<!-- end of col 2 -->' +
  '</td>' +
  '</tr>' +
  '<tr>' +
  '<td width="100%" height="10"></td>' +
  '</tr>' +
  '${TRIP_BODY}';

export const subSegmentHtmlEmailTemplate =
  '<!-- TRIP DETAILS -->' +
  '<tr bgColor="#FFFFFF">' +
  '<td style="text-align: center;font-size: 0;">' +
  '<table border="0" cellpadding="0" cellspacing="0">' +
  '<tr>' +
  '<td>' +
  '<!-- col 1 -->' +
  '<table width="84" align="left" border="0" cellpadding="0" cellspacing="0" class="devicewidth">' +
  '<tbody>' +
  '<tr>' +
  '<td>' +
  '<!-- start of text content table -->' +
  '<table width="100%" align="center" border="0" cellpadding="0" cellspacing="0" class="devicewidthinner">' +
  '<tbody>' +
  '<!-- Spacing -->' +
  '<tr>' +
  '<td width="540" height="5" style="font-size:1px; line-height:1px; mso-line-height-rule: exactly;width: 540px!important;">&nbsp;</td>' +
  '</tr>' +
  '<!-- Spacing -->' +
  '<!-- content2 -->' +
  '<tr>' +
  // tslint:disable-next-line: max-line-length
  '<td style="font-family: Helvetica, arial, sans-serif; font-size: 12px; color: #666; text-align:left;line-height: 20px;" st-content="3col-para1">Flight: ${CMPNY} ${FLIGHT}</td>' +
  '</tr>' +
  '</tbody>' +
  '</table>' +
  '</td>' +
  '</tr>' +
  '<!-- end of text content table -->' +
  '</tbody>' +
  '</table>' +
  '<!-- spacing -->' +
  '<table width="4" align="left" border="0" cellpadding="0" cellspacing="0" class="removeMobile">' +
  '<tbody>' +
  '<tr>' +
  '<td width="100%" height="5" style="font-size:1px; line-height:1px; mso-line-height-rule: exactly;">&nbsp;</td>' +
  '</tr>' +
  '</tbody>' +
  '</table>' +
  '<!-- end of spacing -->' +
  '${SUB_SEGMENT_LAYOUT}' +
  '</td>' +
  '</tr>' +
  '</table>' +
  '<table border="0" cellpadding="0" cellspacing="0">' +
  '<tr>' +
  '<td>' +
  '<!-- spacing -->' +
  '<table width="88" align="left" border="0" cellpadding="0" cellspacing="0" class="removeMobile">' +
  '<tbody>' +
  '<tr>' +
  '<td width="100%" height="5" style="font-size:1px; line-height:1px; mso-line-height-rule: exactly;">&nbsp;</td>' +
  '</tr>' +
  '</tbody>' +
  '</table>' +
  '<!-- end of spacing -->' +
  '<!-- col 5 -->' +
  '<table width="452" align="left" border="0" cellpadding="0" cellspacing="0" class="devicewidth">' +
  '<tbody>' +
  '<tr>' +
  '<td>' +
  '<!-- start of text content table -->' +
  '<table width="452" align="center" border="0" cellpadding="0" cellspacing="0" class="devicewidthinner" style="min-width:132px">' +
  '<tbody>' +
  '<!-- Spacing -->' +
  '<tr>' +
  '<td width="100%" height="5" style="font-size:1px; line-height:1px; mso-line-height-rule: exactly;width: 540px!important;">&nbsp;</td>' +
  '</tr>' +
  '<!-- Spacing -->' +
  '<!-- content4 -->' +
  '<tr>' +
  // tslint:disable-next-line: max-line-length
  '<td style="font-family: Helvetica, arial, sans-serif; font-size: 12px; color: #666; text-align:left;line-height: 20px;" st-content="3col-para2">${BAG_INFO}</td>' +
  '</tr>' +
  '<!-- end of content4 -->' +
  '<!-- Spacing -->' +
  '<tr>' +
  '<td width="100%" height="5" style="font-size:1px; line-height:1px; mso-line-height-rule: exactly;">&nbsp;</td>' +
  '</tr>' +
  '<!-- /Spacing -->' +
  '</tbody>' +
  '</table>' +
  '</td>' +
  '</tr>' +
  '<!-- end of text content table -->' +
  '</tbody>' +
  '</table>' +
  '<!-- end of col 5 -->' +
  '</td>' +
  '</tr>' +
  '</table>' +
  '</td>' +
  '</tr>';

export const longSubSegmentHtmlEmailTemplate =
  '<!-- col 2 -->' +
  '<table width="148" align="left" border="0" cellpadding="0" cellspacing="0" class="devicewidth">' +
  '<tbody>' +
  '<tr>' +
  '<td>' +
  '<!-- start of text content table -->' +
  '<table width="148" align="center" border="0" cellpadding="0" cellspacing="0" class="devicewidthinner" style="min-width:148px">' +
  '<tbody>' +
  '<!-- Spacing -->' +
  '<tr>' +
  '<td width="100%" height="5" style="font-size:1px; line-height:1px; mso-line-height-rule: exactly;width: 540px!important;">&nbsp;</td>' +
  '</tr>' +
  '<!-- Spacing -->' +
  '<!-- content2 -->' +
  '<tr>' +
  // tslint:disable-next-line: max-line-length
  '<td style="font-family: Helvetica, arial, sans-serif; font-size: 12px; color: #666; text-align:left;line-height: 20px;" st-content="3col-para2">Dep: ${DPRTRE_DATE} | <strong>${DPRTRE_TIME}</strong><br/><strong>${DPRTRE_AIRPORT}</strong> ${DPRTRE_TERMINAL}</td>' +
  '</tr>' +
  '</tbody>' +
  '</table>' +
  '</td>' +
  '</tr>' +
  '<!-- end of text content table -->' +
  '</tbody>' +
  '</table>' +
  '<!-- end of col 2 -->' +
  '<!-- spacing -->' +
  '<table width="4" align="left" border="0" cellpadding="0" cellspacing="0" class="removeMobile">' +
  '<tbody>' +
  '<tr>' +
  '<td width="100%" height="5" style="font-size:1px; line-height:1px; mso-line-height-rule: exactly;">&nbsp;</td>' +
  '</tr>' +
  '</tbody>' +
  '</table>' +
  '<!-- end of spacing -->' +
  '<!-- col 3 -->' +
  '<table width="148" align="left" border="0" cellpadding="0" cellspacing="0" class="devicewidth" style="min-width:148px">' +
  '<tbody>' +
  '<tr>' +
  '<td>' +
  '<!-- start of text content table -->' +
  '<table width="148" align="center" border="0" cellpadding="0" cellspacing="0" class="devicewidthinner">' +
  '<tbody>' +
  '<!-- Spacing -->' +
  '<tr>' +
  '<td width="100%" height="5" style="font-size:1px; line-height:1px; mso-line-height-rule: exactly;width: 540px!important;">&nbsp;</td>' +
  '</tr>' +
  '<!-- Spacing -->' +
  '<!-- content -->' +
  '<tr>' +
  // tslint:disable-next-line: max-line-length
  '<td style="font-family: Helvetica, arial, sans-serif; font-size: 12px; color: #666; text-align:left;line-height: 20px;" st-content="3col-para1">Arr: ${ARVL_DATE} | <strong>${ARVL_TIME}</strong><br/><strong>${ARVL_AIRPORT}</strong> ${ARVL_TERMINAL}</td>' +
  '</tr>' +
  '</tbody>' +
  '</table>' +
  '</td>' +
  '</tr>' +
  '<!-- end of text content table -->' +
  '</tbody>' +
  '</table>' +
  '<!-- spacing -->' +
  '<table width="4" align="left" border="0" cellpadding="0" cellspacing="0" class="removeMobile">' +
  '<tbody>' +
  '<tr>' +
  '<td width="100%" height="5" style="font-size:1px; line-height:1px; mso-line-height-rule: exactly;">&nbsp;</td>' +
  '</tr>' +
  '</tbody>' +
  '</table>' +
  '<!-- end of spacing -->' +
  '<!-- col 4 -->' +
  '<table width="148" align="left" border="0" cellpadding="0" cellspacing="0" class="devicewidth" style="min-width:148px">' +
  '<tbody>' +
  '<tr>' +
  '<td>' +
  '<!-- start of text content table -->' +
  '<table width="148" align="center" border="0" cellpadding="0" cellspacing="0" class="devicewidthinner" style="min-width:148px">' +
  '<tbody>' +
  '<!-- Spacing -->' +
  '<tr>' +
  '<td width="100%" height="5" style="font-size:1px; line-height:1px; mso-line-height-rule: exactly;width: 540px!important;">&nbsp;</td>' +
  '</tr>' +
  '<!-- Spacing -->' +
  '<!-- content4 -->' +
  '<tr>' +
  // tslint:disable-next-line: max-line-length
  '<td style="font-family: Helvetica, arial, sans-serif; font-size: 12px; color: #666; text-align:left;line-height: 20px;" st-content="3col-para2">' +
  'Duration: ${DURATION}<br/>${OPERATED_BY}Aircraft: ${AIRCRAFT}${CABIN_CLASS}' +
  '</td>' +
  '</tr>' +
  '</tbody>' +
  '</table>' +
  '</td>' +
  '</tr>' +
  '<!-- end of text content table -->' +
  '</tbody>' +
  '</table>' +
  '<!-- end of col 4 -->';

export const shortSubSegmentHtmlEmailTemplate =
  '<!-- col 2 -->' +
  '<table width="224" align="left" border="0" cellpadding="0" cellspacing="0" class="devicewidth">' +
  '<tbody>' +
  '<tr>' +
  '<td>' +
  '<!-- start of text content table -->' +
  '<table width="224" align="center" border="0" cellpadding="0" cellspacing="0" class="devicewidthinner" style="min-width:224px">' +
  '<tbody>' +
  '<!-- Spacing -->' +
  '<tr>' +
  '<td width="100%" height="5" style="font-size:1px; line-height:1px; mso-line-height-rule: exactly;width: 540px!important;">&nbsp;</td>' +
  '</tr>' +
  '<!-- Spacing -->' +
  '<!-- content2 -->' +
  '<tr>' +
  // tslint:disable-next-line: max-line-length
  '<td style="font-family: Helvetica, arial, sans-serif; font-size: 12px; color: #666; text-align:left;line-height: 20px;" st-content="3col-para2">Dep: ${DPRTRE_DATE} | <strong>${DPRTRE_TIME}</strong><br/><strong>${DPRTRE_AIRPORT}</strong> ${DPRTRE_TERMINAL}</td>' +
  '</tr>' +
  '</tbody>' +
  '</table>' +
  '</td>' +
  '</tr>' +
  '<!-- end of text content table -->' +
  '</tbody>' +
  '</table>' +
  '<!-- end of col 2 -->' +
  '<!-- spacing -->' +
  '<table width="4" align="left" border="0" cellpadding="0" cellspacing="0" class="removeMobile">' +
  '<tbody>' +
  '<tr>' +
  '<td width="100%" height="5" style="font-size:1px; line-height:1px; mso-line-height-rule: exactly;">&nbsp;</td>' +
  '</tr>' +
  '</tbody>' +
  '</table>' +
  '<!-- end of spacing -->' +
  '<!-- col 3 -->' +
  '<table width="224" align="left" border="0" cellpadding="0" cellspacing="0" class="devicewidth" style="min-width:224px">' +
  '<tbody>' +
  '<tr>' +
  '<td>' +
  '<!-- start of text content table -->' +
  '<table width="224" align="center" border="0" cellpadding="0" cellspacing="0" class="devicewidthinner">' +
  '<tbody>' +
  '<!-- Spacing -->' +
  '<tr>' +
  '<td width="100%" height="5" style="font-size:1px; line-height:1px; mso-line-height-rule: exactly;width: 540px!important;">&nbsp;</td>' +
  '</tr>' +
  '<!-- Spacing -->' +
  '<!-- content -->' +
  '<tr>' +
  // tslint:disable-next-line: max-line-length
  '<td style="font-family: Helvetica, arial, sans-serif; font-size: 12px; color: #666; text-align:left;line-height: 20px;" st-content="3col-para1">Arr: ${ARVL_DATE} | <strong>${ARVL_TIME}</strong><br/><strong>${ARVL_AIRPORT}</strong> ${ARVL_TERMINAL}</td>' +
  '</tr>' +
  '</tbody>' +
  '</table>' +
  '</td>' +
  '</tr>' +
  '<!-- end of text content table -->' +
  '</tbody>' +
  '</table>' +
  '<!-- end of col 3 -->';

export const hrHtmlEmailTemplate =
  '<tr>' +
  '<td width="100%" height="20">' +
  '</td>' +
  '</tr>' +
  '<tr>' +
  '<td>' +
  '<hr size="0" bgcolor="#6A6A6A" border="0" style="background-color:#6A6A6A;border:none!important;height:2px!important;"/>' +
  '</td>' +
  '</tr>';

export const subSegmentSeparatorHtmlTemplate =
  '<tr>' + '<td>' + '<hr style="border-style:dotted!important;border-bottom-width:0!important;color:#666!important;"/>' + '</td>' + '</tr>';

export const mainHtmlEmailTemplate =
  '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">' +
  '<html xmlns="http://www.w3.org/1999/xhtml">' +
  '<head>' +
  '<meta http-equiv="Content-Type" content="text/html; charset=utf-8">' +
  '<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
  '<!--[if !mso]><!-->' +
  '<meta http-equiv="X-UA-Compatible" content="IE=edge" />' +
  '<!--<![endif]-->' +
  '<!--[if (gte mso 9)|(IE)]>' +
  '<style type="text/css">' +
  'table {border-collapse: collapse;}' +
  '</style>' +
  '<![endif]-->' +
  '<title></title>' +
  '<style type = "text/css">' +
  '.wrapper {' +
  'width: 100%;' +
  'table-layout: fixed;' +
  '-webkit-text-size-adjust: 100%;' +
  '-ms-text-size-adjust: 100%;' +
  '}' +
  '.webkit {' +
  'margin: 0 auto;' +
  '}' +
  'body {' +
  'margin: 0 !important;' +
  'padding: 0;' +
  'background-color: #ffffff;' +
  '}' +
  '/* Client-specific Styles */' +
  '#outlook a {padding:0;} /* Force Outlook to provide a "view in browser" menu link. */' +
  'body{width:100% !important; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; margin:0; padding:0;}' +
  '/* Prevent Webkit and Windows Mobile platforms from changing default font sizes, while not breaking desktop design. */' +
  '.ExternalClass {width:100%;} /* Force Hotmail to display emails at full width */' +
  // tslint:disable-next-line: max-line-length
  '.ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {line-height: 100%;} /* Force Hotmail to display normal line spacing.  More on that: http://www.emailonacid.com/forum/viewthread/43/ */' +
  '#backgroundTable {margin:0; padding:0; width:100% !important; line-height: 100% !important;}' +
  'img {outline:none; text-decoration:none;border:none; -ms-interpolation-mode: bicubic;}' +
  'a img {border:none;}' +
  '.image_fix {display:block;}' +
  'p {margin: 0px 0px !important;}' +
  '' +
  'table td {border-collapse: collapse;white-space:pre-wrap}' +
  'table { border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; }' +
  '/*a {color: #e95353;text-decoration: none;text-decoration:none!important;}*/' +
  '/*STYLES*/' +
  'table[class=full] { width: 100%; clear: both; }' +
  '' +
  '/*################################################*/' +
  '/*IPAD STYLES*/' +
  '/*################################################*/' +
  '@media only screen and (max-width: 640px) {' +
  'a[href^="tel"], a[href^="sms"] {' +
  'text-decoration: none;' +
  'color: #ffffff; /* or whatever your want */' +
  'pointer-events: none;' +
  'cursor: default;' +
  '}' +
  '.mobile_link a[href^="tel"], .mobile_link a[href^="sms"] {' +
  'text-decoration: default;' +
  'color: #ffffff !important;' +
  'pointer-events: auto;' +
  'cursor: default;' +
  '}' +
  'table[class=devicewidth] {width: 440px!important;text-align:center!important;}' +
  'table[class=devicewidthborder] {width: 438px!important;text-align:center!important;}' +
  'table[class=devicewidthinner] {width: 420px!important;text-align:center!important;}' +
  'table[class="removeMobile"]{display: none!important;}' +
  'table[class="sthide"]{display: none!important;}' +
  'img[class="bigimage"]{width: 420px!important;}' +
  'img[class="col2img"]{width: 420px!important;height:258px!important;}' +
  'img[class="image-banner"]{width: 440px!important;height:106px!important;}' +
  'td[class="menu"]{text-align:center !important; padding: 0 0 10px 0 !important;}' +
  'td[class="logo"]{padding:10px 0 5px 0!important;margin: 0 auto !important;}' +
  'img[class="logo"]{padding:0!important;margin: 0 auto !important;}' +
  '}' +
  '/*##############################################*/' +
  '/*IPHONE STYLES*/' +
  '/*##############################################*/' +
  '@media only screen and (max-width: 480px) {' +
  'a[href^="tel"], a[href^="sms"] {' +
  'text-decoration: none;' +
  'color: #ffffff; /* or whatever your want */' +
  'pointer-events: none;' +
  'cursor: default;' +
  '}' +
  '.mobile_link a[href^="tel"], .mobile_link a[href^="sms"] {' +
  'text-decoration: default;' +
  'color: #ffffff !important; ' +
  'pointer-events: auto;' +
  'cursor: default;' +
  '}' +
  'table[class=devicewidth] {width: 280px!important;text-align:center!important;}' +
  'table[class=devicewidthinner] {width: 260px!important;text-align:center!important;}' +
  'table[class="sthide"]{display: none!important;}' +
  'img[class="bigimage"]{width: 260px!important;}' +
  'img[class="col2img"]{width: 260px!important;height:160px!important;}' +
  'img[class="image-banner"]{width: 280px!important;height:68px!important;}' +
  '} ' +
  '</style>' +
  '</head>' +
  '<body bgColor="#F6F4F5">' +
  '<div class="webkit" bgColor="#F6F4F5">' +
  '${EMAIL_BODY}' +
  '</div>' +
  '</body>' +
  '</html>';

export const emailSentBy =
  'Sent by <a href="https://www.tts.com/tts-webagent/overview/" target="_blank">TTS WebAgent</a>';
