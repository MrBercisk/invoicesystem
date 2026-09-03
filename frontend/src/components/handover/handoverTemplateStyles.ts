
export type Template = 'minimalis';

export const getTemplateStyles = (
  _template: Template = 'minimalis'
): string => {
  return `
    @page {
      size: A4;
      margin: 16mm;
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 0;
      background: white;
      color: #18181b;
      font-family:
        'Plus Jakarta Sans',
        Arial,
        sans-serif;
      font-size: 11px;
      line-height: 1.5;
    }

    .wrap {
      width: 100%;
      max-width: 794px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 24px;
      margin-bottom: 24px;
      padding-bottom: 14px;
      border-bottom: 1px solid #e4e4e7;
    }

    .company-logo {
      display: block;
      max-width: 120px;
      max-height: 50px;
      object-fit: contain;
      margin-bottom: 8px;
    }

    .company-name {
      font-size: 15px;
      font-weight: 800;
      color: #18181b;
    }

    .company-info {
      margin-top: 4px;
      font-size: 9.5px;
      line-height: 1.5;
      color: #71717a;
    }

    .invoice-title {
      font-size: 14px;
      font-weight: 800;
      text-align: right;
      color: #18181b;
    }

    .invoice-number {
      margin-top: 3px;
      font-size: 10px;
      font-weight: 600;
      text-align: right;
      color: #52525b;
    }

    .invoice-meta {
      margin-top: 6px;
      font-size: 9.5px;
      line-height: 1.6;
      text-align: right;
      color: #71717a;
    }

    .invoice-meta .label {
      font-weight: 600;
      color: #52525b;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10px;
    }

    thead th {
      padding: 7px 6px;
      background: #f4f4f5;
      border-top: 1px solid #e4e4e7;
      border-bottom: 1px solid #e4e4e7;
      font-weight: 700;
      text-align: center;
      color: #27272a;
    }

    tbody td {
      padding: 7px 6px;
      border-bottom: 1px solid #f4f4f5;
      vertical-align: top;
      color: #3f3f46;
    }

    .td-right {
      text-align: right;
    }

    .td-note {
      margin-top: 2px;
      font-size: 9px;
      color: #71717a;
    }

    h4 {
      color: #18181b;
    }

    p {
      margin-top: 0;
    }

    strong {
      font-weight: 700;
      color: #18181b;
    }
    .sign-wrap {
        margin-top: 30px;
        margin-bottom: 18px;
    }

    .sign-box {
        width: 50%;
        text-align: center;
        vertical-align: top;
        font-size: 9.5px;
        padding: 0 20px;
    }

    .sign-label {
        font-weight: 700;
        color: #09090b;
        margin-bottom: 4px;
    }

    .sign-imgwrap {
        position: relative;
        height: 76px;
        margin: 4px 0;
        text-align: center;
    }

    .signature {
        max-height: 70px;
        max-width: 165px;
    }

    .stamp {
        position: absolute;
        width: 70px;
        height: 70px;
        left: 50%;
        top: 50%;
        margin-left: -35px;
        margin-top: -35px;
        opacity: 0.6;
    }

    .sign-name {
        font-weight: 700;
        color: #09090b;
        font-size: 10px;
        border-top: 1px solid #18181b;
        padding-top: 4px;
    }

    .sign-title {
        font-size: 8.5px;
        color: #71717a;
        margin-top: 2px;
    }


    @media print {
      body {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }

      .wrap {
        max-width: none;
      }
    }
  `;
};