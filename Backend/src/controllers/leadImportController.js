import { query } from "../db.js";

export const importLeads = async (req, res) => {
  const { rows } = req.body;

  if (!Array.isArray(rows) || rows.length === 0) {
    return res.status(400).json({ message: "No hay datos para importar" });
  }

  const success = [];
  const errors = [];

  const conn = await query.getConnection();

  try {
    await conn.beginTransaction();

    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];

      try {
        // ================= VALIDAR =================
        if (!r.customer_name || !r.customer_phone) {
          throw new Error("Nombre o teléfono vacío");
        }

        // ================= CLIENTE =================
        let customerId;

        const existing = await conn.query(
          `SELECT id FROM customer WHERE phone = ? LIMIT 1`,
          [r.customer_phone]
        );

        if (existing.length) {
          customerId = existing[0].id;
        } else {
          const customerRes = await conn.query(
            `INSERT INTO customer
            (name, company, email, phone, city)
            VALUES (?,?,?,?,?)`,
            [
              r.customer_name,
              r.company,
              r.customer_email,
              r.customer_phone,
              r.city
            ]
          );

          customerId = customerRes.insertId;
        }

        // ================= LEAD =================
        const leadRes = await conn.query(
          `INSERT INTO lead
          (customerId, stateId, quotedValue, billingValue, originId, priorityId)
          VALUES (?,?,?,?,?,?)`,
          [
            customerId,
            1, // prospeccion
            Number(r.quoted_value) || 0,
            Number(r.billing_value) || 0,
            r.origin ? 1 : null,
            r.priority ? 1 : null
          ]
        );

        success.push({
          row: i + 2,
          leadId: leadRes.insertId
        });

      } catch (err) {
        errors.push({
          row: i + 2,
          error: err.message
        });
      }
    }

    await conn.commit();

    res.json({
      total: rows.length,
      success,
      errors
    });

  } catch (err) {
    await conn.rollback();
    console.error("IMPORT ERROR:", err);

    res.status(500).json({
      message: "Error importando",
      error: err.message
    });

  } finally {
    conn.release();
  }
};
