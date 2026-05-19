import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

interface ReportData {
  businessCategory: string
  businessModel: string
  location: string
  radius: number
  status: string
  confidence: number
  createdAt: string
  scoreCard: {
    competitionScore: number
    demandScore: number
    accessibilityScore: number
    areaFitScore: number
    financialPressureScore: number
    competitionReason: string
    demandReason: string
    accessibilityReason: string
    areaFitReason: string
    financialPressureReason: string
  }
  aiReport: {
    executiveSummary: string
    opportunities: string[]
    risks: string[]
    recommendation: string
    disclaimer: string
  }
  pois: Array<{
    name: string
    type: string
    category?: string
    rating?: number
  }>
}

export class PDFExportService {
  /**
   * Generate PDF report from report data
   */
  async generateReport(data: ReportData): Promise<Blob> {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 20
    let yPosition = margin

    // Title
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(51, 51, 51)
    doc.text('Feasibility Report', margin, yPosition)
    yPosition += 15

    // Report metadata
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(102, 102, 102)
    doc.text(`Business Category: ${data.businessCategory.replace('_', ' ')}`, margin, yPosition)
    yPosition += 8
    doc.text(`Business Model: ${data.businessModel}`, margin, yPosition)
    yPosition += 8
    doc.text(`Location: ${data.location}`, margin, yPosition)
    yPosition += 8
    doc.text(`Radius: ${data.radius}m`, margin, yPosition)
    yPosition += 8
    doc.text(`Generated: ${new Date(data.createdAt).toLocaleDateString()}`, margin, yPosition)
    yPosition += 20

    // Confidence Score
    doc.setFillColor(79, 70, 229)
    doc.rect(margin, yPosition, pageWidth - 2 * margin, 30, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text(`Confidence Score: ${data.confidence}%`, margin + 10, yPosition + 10)
    yPosition += 40

    // Scores Section
    doc.setTextColor(51, 51, 51)
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('Feasibility Scores', margin, yPosition)
    yPosition += 10

    const scoresData = [
      ['Competition', data.scoreCard.competitionScore.toString(), data.scoreCard.competitionReason],
      ['Demand', data.scoreCard.demandScore.toString(), data.scoreCard.demandReason],
      ['Accessibility', data.scoreCard.accessibilityScore.toString(), data.scoreCard.accessibilityReason],
      ['Area Fit', data.scoreCard.areaFitScore.toString(), data.scoreCard.areaFitReason],
      ['Financial Pressure', data.scoreCard.financialPressureScore.toString(), data.scoreCard.financialPressureReason],
    ]

    autoTable(doc, {
      startY: yPosition,
      head: [['Metric', 'Score', 'Reasoning']],
      body: scoresData,
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255] },
      styles: { fontSize: 10 },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 20 },
        2: { cellWidth: 'auto' },
      },
    })

    yPosition = (doc as any).lastAutoTable.finalY + 15

    // Add new page if needed
    if (yPosition > pageHeight - 60) {
      doc.addPage()
      yPosition = margin
    }

    // Competitor Analysis
    doc.setTextColor(51, 51, 51)
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('Competitor Analysis', margin, yPosition)
    yPosition += 10

    const competitors = data.pois.filter(p => p.type === 'competitor_direct' || p.type === 'competitor_indirect')
    if (competitors.length > 0) {
      const competitorData = competitors.map(c => [
        c.name,
        c.type.replace('_', ' '),
        c.category || 'N/A',
        c.rating ? c.rating.toString() : 'N/A',
      ])

      autoTable(doc, {
        startY: yPosition,
        head: [['Name', 'Type', 'Category', 'Rating']],
        body: competitorData,
        theme: 'grid',
        headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255] },
        styles: { fontSize: 10 },
      })

      yPosition = (doc as any).lastAutoTable.finalY + 15
    } else {
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(102, 102, 102)
      doc.text('No competitors found in the analysis area.', margin, yPosition)
      yPosition += 15
    }

    // Add new page if needed
    if (yPosition > pageHeight - 80) {
      doc.addPage()
      yPosition = margin
    }

    // AI Analysis
    doc.setTextColor(51, 51, 51)
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('AI Analysis', margin, yPosition)
    yPosition += 10

    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(102, 102, 102)
    const executiveSummaryLines = doc.splitTextToSize(data.aiReport.executiveSummary, pageWidth - 2 * margin)
    doc.text(executiveSummaryLines, margin, yPosition)
    yPosition += executiveSummaryLines.length * 7 + 10

    // Opportunities
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(16, 185, 129)
    doc.text('Opportunities', margin, yPosition)
    yPosition += 8

    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    data.aiReport.opportunities.forEach((opp, idx) => {
      const oppLines = doc.splitTextToSize(`• ${opp}`, pageWidth - 2 * margin)
      doc.text(oppLines, margin, yPosition)
      yPosition += oppLines.length * 6 + 4
    })

    yPosition += 5

    // Risks
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(239, 68, 68)
    doc.text('Risks', margin, yPosition)
    yPosition += 8

    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    data.aiReport.risks.forEach((risk, idx) => {
      const riskLines = doc.splitTextToSize(`• ${risk}`, pageWidth - 2 * margin)
      doc.text(riskLines, margin, yPosition)
      yPosition += riskLines.length * 6 + 4
    })

    yPosition += 10

    // Add new page if needed
    if (yPosition > pageHeight - 60) {
      doc.addPage()
      yPosition = margin
    }

    // Recommendation
    doc.setFillColor(79, 70, 229)
    doc.rect(margin, yPosition, pageWidth - 2 * margin, 40, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Recommendation', margin + 10, yPosition + 12)
    yPosition += 8

    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    const recLines = doc.splitTextToSize(data.aiReport.recommendation, pageWidth - 2 * margin - 20)
    doc.text(recLines, margin + 10, yPosition + 10)
    yPosition += recLines.length * 6 + 25

    // Disclaimer
    doc.setTextColor(153, 153, 153)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'italic')
    const disclaimerLines = doc.splitTextToSize(data.aiReport.disclaimer, pageWidth - 2 * margin)
    doc.text(disclaimerLines, margin, yPosition)

    // Footer
    const pageCount = doc.internal.pages.length - 1
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(153, 153, 153)
      doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' })
    }

    return doc.output('blob')
  }
}

export const pdfExportService = new PDFExportService()
