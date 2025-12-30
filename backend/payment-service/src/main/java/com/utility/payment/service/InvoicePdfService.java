package com.utility.payment.service;

import java.io.ByteArrayOutputStream;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.lowagie.text.Document;
import com.lowagie.text.Font;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.utility.payment.exception.ApiException;
import com.utility.payment.model.Invoice;
import com.utility.payment.repository.InvoiceRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InvoicePdfService {

    private final InvoiceRepository invoiceRepository;

    public byte[] generateInvoicePdf(String paymentId) {

        Invoice invoice = invoiceRepository.findByPaymentId(paymentId)
                .orElseThrow(() ->
                        new ApiException("Invoice not found",
                                HttpStatus.NOT_FOUND));

        try {
            Document document = new Document();
            ByteArrayOutputStream out = new ByteArrayOutputStream();

            PdfWriter.getInstance(document, out);
            document.open();

            Font title = new Font(Font.HELVETICA, 18, Font.BOLD);
            Font text = new Font(Font.HELVETICA, 12);

            document.add(new Paragraph("UTILITY BILL INVOICE", title));
            document.add(new Paragraph(" "));

            document.add(new Paragraph("Invoice Number: " + invoice.getInvoiceNumber(), text));
            document.add(new Paragraph("Invoice Date: " + invoice.getInvoiceDate(), text));
            document.add(new Paragraph("Bill ID: " + invoice.getBillId(), text));
            document.add(new Paragraph("Payment ID: " + invoice.getPaymentId(), text));
            document.add(new Paragraph("Consumer ID: " + invoice.getConsumerId(), text));

            document.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);

            table.addCell("Description");
            table.addCell("Amount");

            table.addCell("Amount Paid");
            table.addCell(String.valueOf(invoice.getAmountPaid()));

            table.addCell("Tax");
            table.addCell(String.valueOf(invoice.getTax()));

            table.addCell("Penalty");
            table.addCell(String.valueOf(invoice.getPenalty()));

            table.addCell("Total Amount");
            table.addCell(String.valueOf(invoice.getTotalAmount()));

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
}