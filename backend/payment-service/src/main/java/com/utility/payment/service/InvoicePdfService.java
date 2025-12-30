package com.utility.payment.service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.lowagie.text.Document;
import com.lowagie.text.Font;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.utility.payment.exception.ApiException;
import com.utility.payment.model.Invoice;
import com.utility.payment.repository.InvoiceRepository;
import java.time.Month;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InvoicePdfService {

    private final InvoiceRepository invoiceRepository;

    public byte[] generateInvoicePdf(String paymentId) {

        Invoice invoice = invoiceRepository.findByPaymentId(paymentId)
                .orElseThrow(() ->
                        new ApiException("Invoice not found", HttpStatus.NOT_FOUND));

        try {
            Document document = new Document();
            ByteArrayOutputStream out = new ByteArrayOutputStream();

            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = new Font(Font.HELVETICA, 18, Font.BOLD);
            Font headerFont = new Font(Font.HELVETICA, 12, Font.BOLD);
            Font textFont = new Font(Font.HELVETICA, 12);

            // -------- TITLE --------
            document.add(new Paragraph("UTILITY BILL INVOICE", titleFont));
            document.add(new Paragraph(" "));

            DateTimeFormatter formatter =
                    DateTimeFormatter.ofPattern("dd MMM yyyy HH:mm");

            // -------- BASIC INFO --------
            document.add(new Paragraph("Invoice Number: " + invoice.getInvoiceNumber(), textFont));
            document.add(new Paragraph(
                    "Invoice Date: " + invoice.getInvoiceDate().format(formatter),
                    textFont
            ));
            document.add(new Paragraph(
                    "Billing Period: " +
                    Month.of(invoice.getBillingMonth()).name() +
                    " " +
                    invoice.getBillingYear(),
                    textFont
            ));
            document.add(new Paragraph("Bill ID: " + invoice.getBillId(), textFont));
            document.add(new Paragraph("Payment ID: " + invoice.getPaymentId(), textFont));
            document.add(new Paragraph("Consumer ID: " + invoice.getConsumerId(), textFont));

            document.add(new Paragraph(" "));

            // -------- TABLE --------
            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{3f, 2f});

            addHeaderCell(table, "Description", headerFont);
            addHeaderCell(table, "Amount", headerFont);

            addRow(table, "Amount Paid", invoice.getAmountPaid());
            addRow(table, "Tax", invoice.getTax());
            addRow(table, "Penalty", invoice.getPenalty());
            addRow(table, "Total Amount", invoice.getTotalAmount());

            document.add(table);
            document.close();

            return out.toByteArray();

        } catch (Exception e) {
            throw new ApiException(
                    "Failed to generate invoice PDF",
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // ---------- helpers ----------

    private void addHeaderCell(PdfPTable table, String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setPadding(8);
        table.addCell(cell);
    }

    private void addRow(PdfPTable table, String label, double value) {
        table.addCell(label);
        table.addCell(String.format("%.2f", value));
    }
}