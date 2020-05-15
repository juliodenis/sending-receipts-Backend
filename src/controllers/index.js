const nodemailer = require("nodemailer");
const path = require("path");
const sql = require("mssql");
const { config } = require("../database/config");
const emailControl = {};
const { HOST_URI, PASS_URI } = process.env;

emailControl.sendEmail = async (req, res) => {
  const {
    empresa,
    acronimo,
    email,
    descripcion,
    folioFactura,
    modulo,
    movimiento,
  } = req.body;
  const query = `
  SELECT TOP (1)
    'Direccion'= 'E:\\FacturasCFDi\\'+Rtrim(vtaFac.Empresa)+ '\\' + Rtrim(Convert(Char(4),vtaFac.Ejercicio)) + '\\' + Rtrim(Convert(Char(2),vtaFac.Periodo)) + '\\' + Rtrim(vtaFac.Mov) + ' ' + vtaFac.MovID
  FROM
    AnexoMov facVtaRuta
  LEFT OUTER JOIN Venta vtaFac ON facVtaRuta.ID=vtaFac.ID
  WHERE
    facVtaRuta.Rama='${modulo}'
  AND vtaFac.Empresa='${acronimo}'
  AND vtaFac.Estatus='CONCLUIDO'
  AND Rtrim(vtaFac.Mov)='${movimiento}'
  AND Rtrim(vtaFac.MovID)='${folioFactura}'

  `;
  const pool1 = new sql.ConnectionPool(config);
  const pool1Connect = pool1.connect();

  async function messageHandler() {
    await pool1Connect;
    try {
      const request = pool1.request();
      const result = await request.query(query);
      return result.recordset[0].Direccion;
    } catch (error) {
      console.log("SQL Error: ", error);
    }
  }
  const getQuery = await messageHandler(); // Getting the path to find the file
  console.log(getQuery);

  contentHTML = `
    
        <h1>Gracias por comprar en ${empresa}</h1>
        <h3>Le hago entrega de su factura</h3>
        <p>${descripcion}</p>
            
  `;
  const transporter = nodemailer.createTransport({
    host: HOST_URI,
    port: 26,
    secure: false,
    auth: {
      user: "jdenis@corah.com.mx",
      pass: PASS_URI,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `${empresa} <jdenis@corah.com.mx`,
      to: `${email}`,
      subject: `Envío de Factura ${empresa}`,
      html: contentHTML,
      attachments: [
        {
          filename: `${movimiento} ${folioFactura.toUpperCase()}.pdf`,
          path: path.join(
            __dirname,
            `../uploads/Factura v3Cfdi ${folioFactura.toUpperCase()}.pdf`
          ),
        },
        {
          filename: `${movimiento} ${folioFactura.toUpperCase()}.xml`,
          path: path.join(
            __dirname,
            `../uploads/Factura v3Cfdi ${folioFactura.toUpperCase()}.xml`
          ),
        },
      ],
    });
    console.log("Message sent", info.messageId);
    res.send("good");
  } catch (error) {
    console.log(
      res.status(204).json({ message: "El contenido no fue admitido" })
    );
  }
};

module.exports = emailControl;
