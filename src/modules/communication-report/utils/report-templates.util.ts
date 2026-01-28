export const inHouseReportTemplates = async function (
   templateAttributes: string,
   response: any[],
   formattedDate: string
) {
   const email: any = {};
   const templateName = templateAttributes;
   const [whatsappReport, smsReport, emailReport] = response;

   let reportRows = '';
   let smsReports = '';
   let emailReports = '';

   let parsedData = JSON.parse(whatsappReport.body);
   let smsData = JSON.parse(smsReport.body);
   let emailData = JSON.parse(emailReport.body);

   for (const template of Object.keys(parsedData.result)) {
      const data = parsedData.result[template];
      const error_count =
         data.other +
         data.unknown_subscriber +
         data.deferred +
         data.blocked_for_user +
         data.hour_exceeded;

      const successRate =
         data.success > 0 ? (error_count / data.success) * 100 : 0;

      reportRows += `
          <tr style="background-color:#f9f9f9;">
            <td style="padding: 10px; border: 1px solid #d19d3b;">WhatsApp</td>
            <td style="padding: 10px; border: 1px solid #d19d3b;">${template}</td>
            <td style="padding: 10px; border: 1px solid #d19d3b;">${data.hitcount
         }</td>
            <td style="padding: 10px; border: 1px solid #d19d3b;">${data.success
         }</td>
            <td style="padding: 10px; border: 1px solid #d19d3b;">${error_count}</td>
            <td style="padding: 10px; border: 1px solid #d19d3b;">${successRate.toFixed(
            2
         )}%</td>
          </tr>
        `;
   }

   for (const template of Object.keys(smsData.result)) {
      const data = smsData.result[template];
      const successRate = data.success > 0 ? (data.fail / data.success) * 100 : 0;

      smsReports += `
          <tr>
            <td style="padding: 10px; border: 1px solid #d19d3b;">SMS</td>
            <td style="padding: 10px; border: 1px solid #d19d3b;">${template}</td>
            <td style="padding: 10px; border: 1px solid #d19d3b;">${data.hitcount
         }</td>
            <td style="padding: 10px; border: 1px solid #d19d3b;">${data.success
         }</td>
            <td style="padding: 10px; border: 1px solid #d19d3b;">${data.fail
         }</td>
            <td style="padding: 10px; border: 1px solid #d19d3b;">${successRate.toFixed(
            2
         )}%</td>
          </tr>
        `;
   }

   for (const template of Object.keys(emailData.result)) {
      const data = emailData.result[template];
      const successRate =
         data.delivery > 0 ? (data.bounce / data.delivery) * 100 : 0;

      emailReports += `
         <tr>
           <td style="padding: 10px; border: 1px solid #d19d3b;">Email</td>
           <td style="padding: 10px; border: 1px solid #d19d3b;">${template}</td>
           <td style="padding: 10px; border: 1px solid #d19d3b;">${data.hitcount
         }</td>
           <td style="padding: 10px; border: 1px solid #d19d3b;">${data.delivery
         }</td>
           <td style="padding: 10px; border: 1px solid #d19d3b;">${data.bounce
         }</td>
           <td style="padding: 10px; border: 1px solid #d19d3b;">${successRate.toFixed(
            2
         )}%</td>
         </tr>
       `;
   }

   email.dailyreport = {
      options: {
         sandbox: false,
      },
      content: {
         from: "info@mailer.thesleepcompany.in",
         subject: "Communication dashboard daily report! (Only desktop view)",
         html: `<head>
   <title></title>
   <meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
   <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
   <!--[if mso]>
   <xml>
      <o:OfficeDocumentSettings>
         <o:PixelsPerInch>96</o:PixelsPerInch>
         <o:AllowPNG/>
      </o:OfficeDocumentSettings>
   </xml>
   <![endif]--><!--[if !mso]><!-->
   <link href="https://fonts.googleapis.com/css2?family=Lato:wght@100;200;300;400;500;600;700;800;900" rel="stylesheet" type="text/css"/>
   <!--<![endif]-->
   <style>
      * {
      box-sizing: border-box;
      }
      body {
      margin: 0;
      padding: 0;
      }
      a[x-apple-data-detectors] {
      color: inherit !important;
      text-decoration: inherit !important;
      }
      #MessageViewBody a {
      color: inherit;
      text-decoration: none;
      }
      p {
      line-height: inherit
      }
      .desktop_hide,
      .desktop_hide table {
      mso-hide: all;
      display: none;
      max-height: 0px;
      overflow: hidden;
      }
      .image_block img+div {
      display: none;
      }
      sup,
      sub {
      line-height: 0;
      font-size: 75%;
      }
      @media (max-width:670px) {
      .desktop_hide table.icons-inner {
      display: inline-block !important;
      }
      .icons-inner {
      text-align: center;
      }
      .icons-inner tdf {
      margin: 0 auto;
      }
      .mobile_hide {
      display: none;
      }
      .row-content {
      width: 100% !important;
      }
      .stack .column {
      width: 100%;
      display: block;
      }
      .mobile_hide {
      min-height: 0;
      max-height: 0;
      max-width: 0;
      overflow: hidden;
      font-size: 0px;
      }
      .desktop_hide,
      .desktop_hide table {
      display: table !important;
      max-height: none !important;
      }
      .row-2 .column-1 .block-1.paragraph_block td.pad>div,
      .row-2 .column-1 .block-2.paragraph_block td.pad>div,
      .row-2 .column-1 .block-3.paragraph_block td.pad>div,
      .row-2 .column-1 .block-4.paragraph_block td.pad>div {
      font-size: 15px !important;
      }
      }
   </style>
   <!--[if mso ]>
   <style>sup, sub { font-size: 100% !important; } sup { mso-text-raise:10% } sub { mso-text-raise:-10% }</style>
   <![endif]--><!--[if true]>
   <style>.forceBgColor{background-color: white !important}</style>
   <![endif]-->
</head>
<body class="body forceBgColor" style="background-color: transparent; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
   <table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: transparent; background-size: auto; background-image: none; background-position: top left; background-repeat: no-repeat;" width="100%">
      <tbody>
         <tr>
            <td>
               <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-size: auto;" width="100%">
                  <tbody>
                     <tr>
                        <td>
                           <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-size: auto; background-color: #ffffff; border-radius: 0; color: #000000; width: 650px; margin: 0 auto;" width="650">
                              <tbody>
                                 <tr>
                                    <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                                       <table border="0" cellpadding="0" cellspacing="0" class="image_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                          <tr>
                                             <td class="pad" style="width:100%;">
                                                <div align="center" class="alignment" style="line-height:10px"></div>
                                             </td>
                                          </tr>
                                       </table>
                                    </td>
                                 </tr>
                              </tbody>
                           </table>
                        </td>
                     </tr>
                  </tbody>
               </table>
               <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-size: auto;" width="100%">
                  <tbody>
                     <tr>
                        <td>
                           <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-size: auto; background-color: #f6f5f1; border-radius: 0; color: #000000; border-left: 30px solid transparent; border-right: 30px solid transparent; width: 650px; margin: 0 auto;" width="650">
                              <tbody>
                                 <tr>
                                    <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                                       <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                          <tr>
                                             <td class="pad" style="padding-top:10px;">
                                                <div style="color:#222222;direction:ltr;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:19.2px;"> </div>
                                             </td>
                                          </tr>
                                       </table>
                                       <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                          <tr>
                                             <td class="pad" style="padding-top:10px;">
                                                <div style="color:#222222;direction:ltr;font-family:'Lato', Tahoma, Verdana, Segoe, sans-serif;font-size:37px;font-weight:700;letter-spacing:0px;line-height:120%;text-align:center;mso-line-height-alt:44.4px;">
                                                   <p style="margin: 0;"><em><strong>Communication Report</strong></em></p>
                                                </div>
                                             </td>
                                          </tr>
                                       </table>
                                       <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                          <tr>
                                             <td class="pad" style="padding-top:10px;">
                                                <div style="color:#222222;direction:ltr;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:center;mso-line-height-alt:19.2px;">
                                                   <p style="margin: 0;"><em><strong>Date: ${formattedDate}</strong></em></p>
                                                </div>
                                             </td>
                                          </tr>
                                       </table>
                                       <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                          <tr>
                                             <td class="pad" style="padding-top:10px;">
                                                <div style="color:#222222;direction:ltr;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:19.2px;"> </div>
                                             </td>
                                          </tr>
                                       </table>
                                    </td>
                                 </tr>
                              </tbody>
                           </table>
                        </td>
                     </tr>
                  </tbody>
               </table>
               <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                  <tbody>
                     <tr>
                        <td>
                           <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f6f5f1; border-radius: 0; color: #000000; border-left: 20px solid transparent; border-right: 20px solid transparent; border-top: 20px solid transparent; width: 650px; margin: 0 auto;" width="650">
                              <tbody>
                                 <tr>
                                    <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 30px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                                       <table border="0" cellpadding="10" cellspacing="0" class="table_block mobile_hide block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                          <tr>
                                             <td class="pad">
                                                <table style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; width: 100%; table-layout: fixed; direction: ltr; background-color: #ffffff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-weight: 400; color: #222222; text-align: right; letter-spacing: 0px; word-break: break-all;" width="100%">
                                                   <thead style="vertical-align: top; background-color: #eddab2; color: #222222; font-size: 16px; line-height: 120%; text-align: right;">
                                                      <tr>
                                                         <th style="padding: 10px; word-break: break-word; font-weight: 700; border-top: 1px solid #d19d3b; border-right: 1px solid #d19d3b; border-bottom: 1px solid #d19d3b; border-left: 1px solid #d19d3b;" width="16.666666666666668%">Channel</th>
                                                         <th style="padding: 10px; word-break: break-word; font-weight: 700; border-top: 1px solid #d19d3b; border-right: 1px solid #d19d3b; border-bottom: 1px solid #d19d3b; border-left: 1px solid #d19d3b;" width="16.666666666666668%"><strong>Template</strong></th>
                                                         <th style="padding: 10px; word-break: break-word; font-weight: 700; border-top: 1px solid #d19d3b; border-right: 1px solid #d19d3b; border-bottom: 1px solid #d19d3b; border-left: 1px solid #d19d3b;" width="16.666666666666668%">Total Hits</th>
                                                         <th style="padding: 10px; word-break: break-word; font-weight: 700; border-top: 1px solid #d19d3b; border-right: 1px solid #d19d3b; border-bottom: 1px solid #d19d3b; border-left: 1px solid #d19d3b;" width="16.666666666666668%">Success Count</th>
                                                         <th style="padding: 10px; word-break: break-word; font-weight: 700; border-top: 1px solid #d19d3b; border-right: 1px solid #d19d3b; border-bottom: 1px solid #d19d3b; border-left: 1px solid #d19d3b;" width="16.666666666666668%">Error Count</th>
                                                         <th style="padding: 10px; word-break: break-word; font-weight: 700; border-top: 1px solid #d19d3b; border-right: 1px solid #d19d3b; border-bottom: 1px solid #d19d3b; border-left: 1px solid #d19d3b;" width="16.666666666666668%">Error %</th>
                                                      </tr>
                                                   </thead>
                                                   <tbody style="vertical-align: top; font-size: 14px; line-height: 120%;">
                                               
                                                   ${reportRows}
                                                   ${smsReports}
                                                   ${emailReports}   

                                                 
                                                   </tbody>
                                                </table>
                                             </td>
                                          </tr>
                                       </table>
                                    </td>
                                 </tr>
                              </tbody>
                           </table>
                        </td>
                     </tr>
                  </tbody>
               </table>
            </td>
         </tr>
      </tbody>
   </table>
   <!-- End -->
</body>`,
      },
      recipients: [
         // {
         //     address: "rohit.y@thesleepcompany.in",
         // },
         // {
         //     address: "sharanya@thesleepcompany.in",
         // },
         // {
         //     address: "vishal.kulkarni@thesleepcompany.in",
         // },
         // {
         //     address: "nilesh.garg@thesleepcompany.in",
         // },
         // {
         //     address: "nirav@thesleepcompany.in",
         // },
         // {
         //     address: "apoorva.grover@thesleepcompany.in",
         // },
         // {
         //     address: "vismaya.madhu@thesleepcompany.in",
         // },
         // {
         //     address: "yashaswi@thesleepcompany.in",
         // },
         // {
         //     address: "priya@thesleepcompany.in",
         // },
         // {
         //     address: "saket.agarwala@thesleepcompany.in",
         // },
         // {
         //     address: "ripal@thesleepcompany.in",
         // }
         {
            address: "akash.more@thesleepcompany.in",
         },
         {
            address: "arpit.tiwari@code-b.dev",
         }
      ],
   };

   return email[templateName];
};
