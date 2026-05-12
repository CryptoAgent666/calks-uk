/**
 * FAQ data for top calculators.
 * Used for FAQPage schema + rendered FAQ section.
 */
export interface FAQ {
  question: string
  answer: string
}

export const CALCULATOR_FAQS: Record<string, FAQ[]> = {
  'income-tax-calculator': [
    { question: `What is the Personal Allowance for 2026/27?`,  answer: `The Personal Allowance for 2026/27 is £12,570 — the amount of income you can earn each tax year before any income tax is due. It applies automatically to most UK residents. The allowance is gradually withdrawn for higher earners: it reduces by £1 for every £2 of income above £100,000, reaching zero at £125,140. This taper creates an effective marginal tax rate of 60% on income between £100,000 and £125,140, because you lose £1 of allowance (worth 40p in tax) for every additional £2 earned, on top of the 40% Higher Rate charge. People with certain tax codes — for example those with unpaid tax from a previous year — may have a reduced effective allowance. Source: HMRC (gov.uk/income-tax-rates).` },
    { question: `What are the UK income tax bands for 2026/27?`,  answer: `For England, Wales and Northern Ireland in 2026/27, income tax is charged in three main bands above the £12,570 Personal Allowance. The Basic Rate of 20% applies to taxable income from £12,571 to £50,270 — meaning a salary of £35,000 attracts 20% on approximately £22,430, equalling £4,486 in income tax. The Higher Rate of 40% applies from £50,271 to £125,140. The Additional Rate of 45% applies to income above £125,140. These bands cover employment income, self-employment profits, rental income and most other sources. Dividend income and capital gains are taxed at different rates. Scottish taxpayers pay different rates under the Scottish Rate of Income Tax, which has six bands including Starter (19%), Basic (20%), Intermediate (21%), Higher (42%), Advanced (45%) and Top (48%). Source: HMRC.` },
    { question: `How does the Personal Allowance taper work?`,  answer: `If your adjusted net income exceeds £100,000, your Personal Allowance is reduced by £1 for every £2 of income above that threshold. This continues until the allowance reaches zero at £125,140. The practical result is that income between £100,000 and £125,140 faces an effective marginal tax rate of 60%: you pay 40% Higher Rate income tax on the income itself, and the loss of each £1 of Personal Allowance means an additional £1 that was previously untaxed now becomes taxable at 40%, adding a further 20p in tax per £2 earned. Making additional pension contributions can reduce adjusted net income below £100,000 and restore part or all of the Personal Allowance, sometimes making them extremely tax-efficient. Source: HMRC.` },
    { question: `Does this calculator work for Scottish taxpayers?`,  answer: `This calculator uses the standard UK income tax rates for England, Wales and Northern Ireland and is not suitable for Scottish taxpayers. Scotland has its own six-band income tax system set by the Scottish Parliament, with rates and thresholds that differ significantly from the rest of the UK. For 2026/27, Scottish rates are: Starter Rate 19% (£12,571–£15,397), Basic Rate 20% (£15,398–£27,491), Intermediate Rate 21% (£27,492–£43,662), Higher Rate 42% (£43,663–£75,000), Advanced Rate 45% (£75,001–£125,140), and Top Rate 48% (above £125,140). Scottish taxpayers should use the dedicated Scottish Income Tax Calculator on this site instead, which correctly applies these bands and thresholds. Source: Scottish Government / Revenue Scotland.` },
  ],
  'national-insurance-calculator': [
    { question: `What are the NI rates for employees in 2026/27?`,  answer: `Employees pay Class 1 National Insurance at two rates in 2026/27. The main rate is 8% on weekly earnings between £242 and £967 (equivalent to £12,570 and £50,270 per year). On earnings above £967 per week (£50,270/year), the rate drops to 2%. There is no NI on earnings below the Primary Threshold of £242/week. For example, an employee earning £40,000 pays NI on £40,000 minus £12,570 = £27,430, at 8%, equalling £2,194.40 per year. The rates were cut from 10% (main) and 12% (old main) in recent years: the main rate was 12% before January 2024, then cut to 10% in January 2024 and to 8% from April 2024. Source: HMRC.` },
    { question: `What is the NI Primary Threshold for 2026/27?`,  answer: `The Primary Threshold for Class 1 National Insurance in 2026/27 is £12,570 per year (£242 per week or £1,048 per month). Employees start paying NI once their earnings exceed this level. Earnings between the Lower Earnings Limit (£6,708/year, £129/week) and the Primary Threshold are treated as if contributions were paid, preserving entitlement to the State Pension and other contributory benefits without actually deducting any money. This means low earners still build up National Insurance credits even if they pay no NI in cash. The Upper Earnings Limit above which the rate drops to 2% is £50,270/year (£967/week), aligned with the Higher Rate income tax threshold. Source: HMRC.` },
    { question: `Do I pay National Insurance after State Pension age?`,  answer: `No. You stop paying Class 1 National Insurance contributions once you reach State Pension age, regardless of whether you continue working. State Pension age is currently 66 for both men and women, rising to 67 between 2026 and 2028. You do not need to tell your employer — once they have a record of your date of birth confirming you have reached State Pension age, they must stop deducting NI. If your employer incorrectly continues deducting NI, you can claim a refund from HMRC. Self-employed workers also stop paying Class 4 NI at State Pension age. Class 2 NI was abolished from April 2024. Employer NI continues to apply regardless of the employee\'s age. Source: HMRC.` },
  ],
  'vat-calculator': [
    { question: `What is the standard VAT rate in the UK?`,  answer: `The standard UK VAT rate is 20%, which applies to most goods and services including electronics, clothing, professional services, restaurant meals, and new-build commercial property. A reduced rate of 5% applies to domestic energy (gas and electricity), children\'s car seats, mobility aids for the elderly, sanitary products, and certain energy-saving materials. The zero rate (0%) applies to most food, children\'s clothing and footwear, books and newspapers, prescribed medicines, and most public transport. VAT-exempt supplies (such as financial services, education, and most healthcare) are different from zero-rated — suppliers of exempt services generally cannot recover the VAT they pay on their own inputs. The VAT registration threshold for 2026/27 is £90,000. Source: HMRC (gov.uk/vat-rates).` },
    { question: `How do I calculate VAT from a gross amount?`,  answer: `To find the VAT element in a gross (VAT-inclusive) price at the standard 20% rate, divide the total by 6. This works because if the net price is 100%, the gross is 120%, and the VAT fraction is 20/120 = 1/6. For example, a gross invoice of £240 contains £40 VAT (£240 ÷ 6) and a net value of £200. To add 20% VAT to a net price, multiply by 1.20 — so a £500 net price becomes £600 gross. For the reduced 5% rate, the VAT fraction from a gross amount is 1/21, and to add VAT you multiply by 1.05. To reverse-calculate from a reduced-rate gross of £105: £105 ÷ 21 = £5 VAT, £100 net. Source: HMRC.` },
    { question: `When do I need to register for VAT?`,  answer: `You must register for VAT if your VAT-taxable turnover exceeds £90,000 in any rolling 12-month period — this is the 2026/27 threshold, the highest it has ever been after being raised from £85,000 in April 2024. You must also register if you expect to exceed the threshold in the next 30 days alone. Registration must be completed within 30 days of exceeding the threshold, and you must charge VAT from the registration date. Voluntary registration is permitted at any turnover level and can be beneficial if your customers are VAT-registered businesses (they can reclaim the VAT you charge) or if you pay significant VAT on your own business purchases. Below the threshold, you cannot charge or reclaim VAT. Source: HMRC (gov.uk/vat-registration).` },
  ],
  'stamp-duty-calculator': [
    { question: `What are the Stamp Duty rates for 2026/27?`,  answer: `Stamp Duty Land Tax (SDLT) in England and Northern Ireland for standard residential purchases in 2026/27 is charged in bands: 0% on the first £125,000; 2% on £125,001 to £250,000; 5% on £250,001 to £925,000; 10% on £925,001 to £1.5 million; 12% above £1.5 million. SDLT is calculated on the portion of the price within each band, not the whole amount. For a £400,000 purchase: 0% on first £125,000 = £0; 2% on next £125,000 = £2,500; 5% on remaining £150,000 = £7,500; total = £10,000. Note that the nil-rate threshold was reduced from £250,000 back to £125,000 from April 2025, reversing the temporary relief introduced in 2022. Source: HMRC (gov.uk/stamp-duty-land-tax).` },
    { question: `Do first-time buyers get a Stamp Duty discount?`,  answer: `Yes — first-time buyers in England and Northern Ireland receive reduced SDLT rates from April 2025. They pay 0% on the first £300,000 and 5% on the portion from £300,001 to £500,000. For a property priced above £500,000, first-time buyer relief does not apply at all, and standard rates are charged on the full amount. For example, a first-time buyer purchasing at £450,000 pays: 0% on £300,000 = £0; 5% on £150,000 = £7,500; total = £7,500. Without the relief, standard rates would give: 0% on £125,000 + 2% on £125,000 + 5% on £200,000 = £12,500. Scotland uses Land and Buildings Transaction Tax (LBTT) and Wales uses Land Transaction Tax (LTT) — different rates and reliefs apply. Source: HMRC.` },
    { question: `What is the additional property surcharge?`,  answer: `A 5% SDLT surcharge applies if you are purchasing an additional residential property while already owning one or more homes. This affects buy-to-let investors, second home buyers, and those who have not yet sold their previous main residence. The surcharge applies to the full purchase price across all bands. For example, a buy-to-let purchase at £250,000 attracts: standard SDLT of £2,500 plus 5% surcharge on the full £250,000 (£12,500), giving a total of £15,000. If you complete on a new main residence before selling your old one, you pay the surcharge but can claim a refund within 12 months of selling the original property. Corporate bodies and funds purchasing residential property face a 17% flat rate above £500,000. Source: HMRC.` },
  ],
  'take-home-pay-calculator': [
    { question: `What deductions come out of my salary?`,  answer: `Your gross salary is subject to four main deductions before you receive your take-home pay. Income tax is calculated based on your tax code and the UK income tax bands (20%, 40%, 45%). Employee National Insurance Class 1 is charged at 8% on earnings between £12,570 and £50,270, and 2% above that. Workplace pension contributions under auto-enrolment are typically 5% of qualifying earnings (£6,240–£50,270) — though higher contributions are common. Student loan repayments apply if you have an outstanding loan: Plan 2 takes 9% of income above £29,385, Plan 5 takes 9% above £25,000, and Postgraduate Loan takes 6% above £21,000. Salary sacrifice arrangements (such as pension or cycle-to-work) reduce gross pay before tax, meaning they reduce all of the above deductions simultaneously. Source: HMRC.` },
    { question: `How is take-home pay calculated in the UK?`,  answer: `UK take-home pay is calculated by working through deductions in a specific order. First, salary sacrifice deductions (such as pension contributions made via sacrifice) are subtracted from gross pay to give the reduced taxable gross. Then income tax is calculated: the Personal Allowance (£12,570) is deducted, and the resulting taxable income is taxed at 20% up to £37,700, then 40%, then 45%. Employee NI is calculated separately on gross earnings (before income tax, but after salary sacrifice) at 8%/2%. Finally, post-tax deductions such as student loan repayments (calculated on gross earnings above the threshold) and any remaining pension contributions not in salary sacrifice are deducted. The result is your net take-home pay. For a £35,000 salary, approximate take-home is around £27,000–£28,000. Source: HMRC.` },
    { question: `What is a tax code and how does it affect my pay?`,  answer: `A tax code tells your employer how much tax-free income you are entitled to each year, and is used to calculate income tax through PAYE. The most common code is 1257L, where the number 1257 means a tax-free allowance of £12,570 (multiply by 10) and the letter L indicates a standard Personal Allowance. Different suffixes apply in different circumstances: M and N are used for Marriage Allowance; K codes mean your deductions exceed your allowances; T or 0T mean HMRC is reviewing your tax affairs; BR means the entire income from that source is taxed at Basic Rate (common for second jobs); D0 means 40% is deducted on all income (Higher Rate on a second source). An incorrect tax code can result in overpayment or underpayment of tax — both can usually be corrected by contacting HMRC or updating your account at gov.uk. Source: HMRC.` },
  ],
  'mortgage-repayment-calculator': [
    { question: `What is the difference between repayment and interest-only mortgages?`,  answer: `A repayment mortgage requires monthly payments that cover both the interest charge and a portion of the outstanding capital, so the debt reduces each month and reaches zero at the end of the term. In the early years, most of the payment is interest; towards the end, most goes to capital. A £200,000 repayment mortgage at 4.5% over 25 years costs approximately £1,112 per month. An interest-only mortgage charges only the monthly interest — £750/month on the same loan — but the £200,000 capital remains outstanding and must be repaid in full at the end of the term. Most residential lenders require a credible repayment plan (such as an investment ISA or pension) before granting interest-only mortgages. Interest-only is more common for buy-to-let purchases. Source: FCA Mortgage Conduct of Business rules.` },
    { question: `How much deposit do I need for a UK mortgage?`,  answer: `Most UK residential mortgage lenders require a minimum deposit of 5% of the property value, making the maximum loan-to-value (LTV) 95%. However, interest rates are significantly better at higher deposit levels. A 5% deposit (95% LTV) might attract a rate of 5.5–6%, while a 25% deposit (75% LTV) could secure 4–4.5%. For a £300,000 property, a 5% deposit is £15,000 with monthly repayments around £1,900 (at 5.5% over 25 years), versus a 25% deposit of £75,000 with repayments around £1,530 (at 4.25%). First-time buyers can access 5% deposit mortgages through the Mortgage Guarantee Scheme. Buy-to-let mortgages typically require 20–25% minimum. New-build properties may also have 5% options through developers. Source: FCA, major UK lenders.` },
    { question: `What happens if interest rates rise?`,  answer: `The impact of interest rate rises depends entirely on your mortgage type. If you have a standard variable rate (SVR) or tracker mortgage, your monthly payments rise automatically when the Bank of England base rate increases — a 1% rate rise on a £200,000 outstanding balance adds approximately £167/month. Fixed-rate mortgages provide certainty for the fixed period: your payments do not change regardless of base rate movements. When a fixed period ends, you are moved to the SVR (usually 2–3% above base rate) unless you remortgage. A 2-year fixed deal taken in 2022 at 2% that expires in 2024 would face renewal at 4.5–5.5% — for many borrowers, an increase of £300–£500/month on the same balance. Using this calculator\'s overpayment feature during a low-rate period reduces the balance and therefore the impact of any future rate rise. Source: Bank of England, FCA.` },
  ],
  'pension-calculator': [
    { question: `How much should I save into my pension?`,  answer: `A common rule of thumb is to halve the age at which you start contributing and use that as the percentage of your pre-tax salary to save. Starting at age 25 would mean saving 12.5%; at 30, around 15%; at 40, around 20%. The legal auto-enrolment minimum is 8% of qualifying earnings (£6,240–£50,270 in 2026/27) split between at least 3% employer and 5% employee. In practice, this minimum is unlikely to be sufficient for a comfortable retirement. The Pensions Policy Institute suggests that a gross contribution of 12–15% of salary from age 25 is needed to achieve roughly two-thirds of final salary as retirement income. Pension contributions receive tax relief — a basic-rate taxpayer investing £80 net effectively contributes £100, while a higher-rate taxpayer can claim back an additional £20 through self-assessment. Source: The Pensions Advisory Service, DWP.` },
    { question: `What is the pension annual allowance for 2026/27?`,  answer: `The pension annual allowance for 2026/27 is £60,000 — the maximum total pension input (your contributions plus employer contributions) that receives tax relief in a single tax year. Contributions above this level are subject to an Annual Allowance Charge at your marginal income tax rate. The allowance can be increased using "carry forward" of unused allowance from the three previous tax years, but only if you were a member of a registered pension scheme in those years. For high earners, the Tapered Annual Allowance reduces the allowance by £1 for every £2 of income above £260,000 (threshold income £200,000), to a minimum of £10,000. Once you have flexibly accessed your pension (taken income from a defined contribution pot), the Money Purchase Annual Allowance of £10,000 applies to further defined contribution inputs. Source: HMRC.` },
    { question: `When can I access my pension?`,  answer: `The minimum pension access age for defined contribution (DC) pensions is currently 55, rising to 57 from 6 April 2028 — though pensions linked to a protected pension age may allow earlier access. At access age, you can normally take up to 25% of your pension pot as a tax-free lump sum (the Pension Commencement Lump Sum), with the remaining 75% drawn as taxable income via annuity, drawdown, or lump sums. Defined benefit (DB) and final salary schemes have their own scheme-specific retirement ages, typically 60 or 65. Taking your pension before State Pension age (currently 66) means your pension must fund more years of retirement. Withdrawing too quickly creates a risk of running out of money in later life — the FCA recommends a sustainable withdrawal rate of approximately 3.5–4% per year. Source: HMRC, FCA.` },
  ],
  'capital-gains-tax-calculator': [
    { question: `What is the CGT annual exempt amount for 2026/27?`,  answer: `The Capital Gains Tax Annual Exempt Amount (AEA) for individuals in 2026/27 is £3,000. You can make gains up to this amount in the tax year without paying CGT. The AEA has been significantly reduced in recent years: it was £12,300 in 2022/23, halved to £6,000 in 2023/24, and halved again to £3,000 from April 2024, where it remains. Each individual has their own AEA — married couples and civil partners each have a separate £3,000 allowance, allowing jointly held assets to benefit from up to £6,000 of gains per year tax-free. Assets held in an ISA are completely exempt from CGT with no limit. Gains on your main residence are usually exempt under Private Residence Relief. Unused AEA cannot be carried forward to future tax years. Source: HMRC (gov.uk/capital-gains-tax).` },
    { question: `What are the CGT rates for 2026/27?`,  answer: `Following the October 2024 Autumn Budget, Capital Gains Tax rates were unified across all asset types from 30 October 2024. Basic-rate taxpayers now pay 18% on all chargeable gains — residential property and other assets alike. Higher and additional-rate taxpayers pay 24% on all gains. This replaced the previous system where non-property gains were taxed at 10% (basic) and 20% (higher), while residential property attracted 18% (basic) and 28% (higher). For gains straddling the Budget date, HMRC allows split calculations. Business Asset Disposal Relief (formerly Entrepreneurs' Relief) applies to qualifying business disposals at 10% (for disposals before 6 April 2026) rising to 14% (2026/27 onwards) on a lifetime limit of £1 million. Investor\'s Relief also exists for external investors in unlisted trading companies. Source: HMRC (gov.uk/capital-gains-tax/rates).` },
    { question: `Do I pay CGT on my main home?`,  answer: `Normally no — your principal private residence (PPR) is exempt from Capital Gains Tax under Private Residence Relief (PRR). You must live in the property as your main home throughout the period of ownership for full exemption. However, CGT may apply in specific circumstances: if you have let out part of the property (letting relief is now restricted to cases where the owner is in shared occupancy with the tenant), if you have used part exclusively for business purposes (not just working from home occasionally), if the grounds exceed 5,000 square metres (including buildings), or if you have operated the property as serviced accommodation (treated as trading rather than residential). The final 9 months of ownership always qualifies for PPR regardless of whether you are still living there, giving some flexibility when selling. Source: HMRC (gov.uk/tax-when-you-sell-your-home).` },
  ],
  'inheritance-tax-calculator': [
    { question: `What is the Inheritance Tax threshold for 2026/27?`,  answer: `The standard nil-rate band (NRB) is £325,000, meaning estates up to this value pay no Inheritance Tax. The Residence Nil-Rate Band (RNRB) adds a further £175,000 if a main residence is passed to direct descendants (children, grandchildren or their spouses), giving a combined threshold of £500,000 per person. A surviving spouse or civil partner inherits the deceased partner\'s unused nil-rate bands, potentially enabling a combined threshold of £1,000,000 for the surviving partner\'s estate. The RNRB tapers by £1 for every £2 the net estate exceeds £2 million, disappearing entirely at £2.35 million per person. Both the NRB and RNRB are frozen at current levels until at least 2028. Gifts made more than 7 years before death are generally exempt, having left the estate. Source: HMRC (gov.uk/inheritance-tax).` },
    { question: `What is the Inheritance Tax rate?`,  answer: `Inheritance Tax is charged at 40% on the value of the estate above the available nil-rate bands. A reduced rate of 36% applies if at least 10% of the net estate (after deducting debts, liabilities, nil-rate band and reliefs) is left to a qualifying charity. For example, an estate of £750,000 with a full £500,000 threshold (NRB + RNRB) would pay 40% on £250,000 = £100,000 in IHT. Business Property Relief reduces the taxable value of qualifying business assets, AIM-listed shares, and farmland by 50% or 100% — though rules on AIM share relief are being restricted from April 2026. Agricultural Property Relief similarly reduces the value of agricultural land and buildings by 50–100%. Life insurance proceeds paid into trust are outside the estate and not subject to IHT. Source: HMRC.` },
  ],
  'dividend-tax-calculator': [
    { question: `What is the dividend allowance for 2026/27?`,  answer: `The dividend allowance for 2026/27 is £500 — the amount of dividend income you can receive annually without paying any dividend tax, regardless of your income tax band. This allowance was £5,000 as recently as 2017/18, was reduced to £2,000 from April 2018, halved to £1,000 from April 2023, and halved again to £500 from April 2024. Dividends within your allowance do not use up any of your basic-rate band; they are simply tax-free. Dividends above the allowance are taxed at 8.75% in the basic-rate band, 33.75% in the higher-rate band, and 39.35% in the additional-rate band. Dividends received within a Stocks and Shares ISA are entirely tax-free with no annual limit. Dividends from UK companies come with a 10% notional tax credit that is taken into account in the calculation. Source: HMRC (gov.uk/tax-on-dividends).` },
    { question: `How are dividends taxed in the UK?`,  answer: `Dividends are taxed after all other income. They are added on top of employment or self-employment income to determine which rate band they fall into, but they are taxed at the lower dividend rates rather than standard income tax rates. The first £500 is covered by the Dividend Allowance (tax-free). Dividends falling within the basic-rate band (income up to £50,270 including dividends) are taxed at 8.75%. Those in the higher-rate band (£50,271–£125,140) are taxed at 33.75%. Additional-rate taxpayers pay 39.35%. For a director-shareholder taking a £12,570 salary plus £30,000 dividends: income tax on salary = £0 (within Personal Allowance); dividend allowance covers first £500; remaining £29,500 of dividends taxed at 8.75% = £2,581. Total tax: £2,581 compared to approximately £7,500 if the same amount were taken entirely as salary. Source: HMRC.` },
  ],
  'student-loan-repayment-calculator': [
    { question: `What are the student loan repayment thresholds for 2026/27?`,  answer: `Student loan repayments are income-contingent and depend on which plan you are on. Plan 1 (pre-2012 English/Welsh borrowers and Scottish borrowers): repay 9% of income above £26,900/year. Plan 2 (English/Welsh borrowers who started 2012–2023): repay 9% above £29,385/year. Plan 3 (Postgraduate Loan): repay 6% above £21,000/year, and this runs alongside any undergraduate loan repayments simultaneously. Plan 4 (Scottish borrowers pre-2012): repay 9% above £33,795/year. Plan 5 (English/Welsh borrowers starting from 2023/24): repay 9% above £25,000/year. Repayments are collected through PAYE for employees and via self-assessment for the self-employed. A Plan 2 borrower earning £35,000 repays 9% × (£35,000 − £29,385) = 9% × £7,705 = £693.45/year, or approximately £57.79/month. Source: Student Loans Company, HMRC.` },
    { question: `When is my student loan written off?`,  answer: `Student loan write-off dates depend on the loan plan. Plan 1 loans are written off 25 years after the April you were first due to repay, or when you turn 65, whichever comes first. Plan 2 loans are written off 30 years after first repayment. Plan 3 (Postgraduate) loans are written off 30 years after first repayment. Plan 4 (Scottish Plan 1) is written off after 30 years or age 65. Plan 5 loans (from 2023) have the longest write-off period: 40 years, meaning a borrower who starts repaying at 23 would not see write-off until age 63. Only borrowers with high earnings throughout their career will repay the full loan balance before write-off — the Institute for Fiscal Studies estimates around 55% of current graduates will never fully repay their Plan 2 loan, making total repayments a more useful planning figure than the outstanding balance. Source: Student Loans Company.` },
  ],
  'self-assessment-tax-calculator': [
    { question: `Who needs to file a Self Assessment tax return?`,  answer: `You must file a Self Assessment tax return for the 2024/25 tax year if any of the following apply: you were self-employed with income over £1,000; you were a company director; your annual income was over £150,000 from any source; you had untaxed income of £2,500 or more (such as rental income, tips, or foreign income); you had taxable income from savings and investments of more than £10,000; you or your partner received Child Benefit while either of you earned over £60,000 (High Income Child Benefit Charge); you claimed tax reliefs worth more than £2,500; or HMRC has sent you a notice to file. If you are unsure whether you need to file, HMRC\'s online tool at gov.uk/check-if-you-need-a-tax-return can check your specific circumstances. Missing the requirement to register can result in late filing penalties. Source: HMRC (gov.uk/self-assessment-tax-returns).` },
    { question: `What is the deadline for Self Assessment?`,  answer: `The key Self Assessment deadlines for the 2024/25 tax year (ending 5 April 2025) are: register for Self Assessment by 5 October 2025 if this is your first time filing; file paper returns by 31 October 2025; file online returns and pay any tax owed by 31 January 2026. Payments on Account (POAs) — advance payments towards next year\'s tax bill — are due on 31 January and 31 July. These apply if last year\'s tax bill exceeded £1,000 and less than 80% was collected at source. Late filing attracts an immediate £100 penalty even if no tax is owed. After 3 months, daily penalties of £10 per day (up to £900 maximum) begin. At 6 and 12 months, further penalties of 5% of the tax owed apply. Late payment attracts interest at the Bank of England base rate plus 2.5% from the due date. Source: HMRC.` },
  ],
  'corporation-tax-calculator': [
    { question: `What is the Corporation Tax rate for 2026/27?`,  answer: `UK Corporation Tax for 2026/27 has two main rates based on annual profits. The small profits rate of 19% applies to companies with profits up to £50,000. The main rate of 25% applies to companies with profits above £250,000. For profits between £50,000 and £250,000, marginal relief provides a gradual taper between the two rates — the effective marginal rate in this band is approximately 26.5%. The marginal relief formula is: standard fraction × (upper limit − profits) × profits ÷ augmented profits. Both the £50,000 and £250,000 thresholds are divided by the number of associated companies plus one, meaning a company with two associates has thresholds of £16,667 and £83,333. The 25% rate was introduced from April 2023; prior to that, a flat 19% rate applied to all companies. Source: HMRC (gov.uk/corporation-tax).` },
    { question: `When do I need to pay Corporation Tax?`,  answer: `Corporation Tax is due 9 months and 1 day after the end of your accounting period. For a company with a year-end of 31 March 2025, the payment deadline is 1 January 2026. Your Company Tax Return (CT600) must be filed with HMRC within 12 months of the accounting period end — so by 31 March 2026 for the same example. Large companies (profits over £1.5m, divided by associated companies) must pay in quarterly instalments during the accounting year itself, rather than waiting until 9 months after. Interest accrues on late payment from the due date. You must file a CT600 even if your company made no profit or a loss, unless HMRC has issued a notice to deliver a return. A dormant company that has never received income may be exempt from filing. Source: HMRC.` },
  ],
  'salary-sacrifice-calculator': [
    { question: `What is salary sacrifice?`,  answer: `Salary sacrifice (also called salary exchange) is an arrangement where you formally agree with your employer to reduce your gross salary by a specified amount, and your employer contributes that amount to your pension or another qualifying benefit instead. Because the sacrifice is made before income tax and National Insurance are calculated, you receive full tax and NI relief on the amount sacrificed — even as a basic-rate taxpayer, making it more tax-efficient than contributing to a pension from net pay. For example, if you sacrifice £200/month: your gross salary falls by £200, saving 20% income tax (£40) and 8% NI (£16) = £56 of savings, meaning the net cost to you is only £144 for a £200 pension contribution. Your employer also saves 15% employer NI (£30), and many employers pass part of this saving back as an enhanced contribution. Source: HMRC.` },
    { question: `Can salary sacrifice reduce my tax bill?`,  answer: `Yes, significantly. Salary sacrifice is one of the most tax-efficient ways to save for retirement in the UK because it reduces your taxable gross pay before both income tax and National Insurance are assessed. Unlike a personal pension contribution (which gives income tax relief at your marginal rate but no NI relief), salary sacrifice avoids NI entirely on the sacrificed amount. For a higher-rate taxpayer sacrificing £500/month: income tax saving 40% = £200; employee NI saving 2% (above £50,270) or 8% (below) = £10–£40; combined saving £210–£240 per month. The employer also saves 15% NI = £75/month and may add this to your pension. A 40% taxpayer could effectively get £500/month into their pension for as little as £260 personal cost after all savings. Sacrifice can also reduce adjusted net income below £100,000 to restore Personal Allowance, saving an additional 20%. Source: HMRC.` },
  ],
  'child-benefit-calculator': [
    { question: `Who qualifies for Child Benefit?`,  answer: `Anyone responsible for a child under 16 (or under 20 if in approved education/training). Rates 2026/27: £27.05/week for eldest/only child, £17.90/week for each additional. Paid every 4 weeks. Only one person can claim per child — usually the mother for the first child (it counts toward State Pension NI credits). Income doesn't affect entitlement directly, but High Income Child Benefit Charge applies if either parent earns over £60,000.` },
    { question: `What is the High Income Child Benefit Charge?`,  answer: `If you or your partner earns over £60,000, you must repay 1% of Child Benefit for every £200 above £60,000. At £80,000+ income, all the Child Benefit is clawed back. The charge is paid via Self Assessment. Many high earners 'opt out' of receiving Child Benefit to avoid Self Assessment — but should still register a claim (just tick 'don't pay me') to get the NI credits toward State Pension.` },
    { question: `Why register for Child Benefit if you don't need the money?`,  answer: `Claiming gives the parent at home with the child (under 12) automatic National Insurance credits — building toward their State Pension. Each year of credits = ~£328/year extra State Pension for life from age 67. Over a typical 35-year working life with 12 years caring for children, that's £3,936/year extra State Pension — worth £80,000+ over a 20-year retirement. Don't miss this just because the cash payment is clawed back.` },

  ],
  'redundancy-pay-calculator': [
    { question: `How is statutory redundancy pay calculated?`,  answer: `UK statutory redundancy pay uses an age-weighted formula based on each complete year of service, up to a maximum of 20 years. You receive: half a week\'s pay for each full year of service where you were aged under 22; one week\'s pay for each year aged 22–40; and one and a half weeks' pay for each year aged 41 or over. Weekly pay is capped at £700 for 2026/27 (rising from £643 in 2024/25). The maximum statutory payment is therefore 20 × 1.5 × £700 = £21,000. To qualify, you need at least 2 years' continuous service with the same employer. For example, a 45-year-old with 8 years' service earning £600/week: years 37–40 (3 years at age 40) = 3 × 1 × £600 = £1,800; years 41–45 (4 years at age 41+) = 4 × 1.5 × £600 = £3,600; total = £5,400. Source: GOV.UK (gov.uk/redundancy-your-rights).` },
    { question: `Is redundancy pay taxable?`,  answer: `The first £30,000 of a genuine redundancy payment is completely exempt from income tax and National Insurance, regardless of whether it is statutory or an enhanced contractual amount. Amounts above £30,000 are subject to income tax at your marginal rate (20%, 40%, or 45%), but no employee National Insurance applies above the £30,000 threshold. The exemption applies only to genuine redundancy payments — it does not cover pay in lieu of notice (PILON), accrued but untaken holiday pay, or enhanced terms that are really a disguised payment for previous services. PILON is always fully taxable and subject to NI. Employer NI is not charged on the first £30,000 of the redundancy payment, making it tax-efficient for the employer too. If you have been made redundant and also receive a payment for loss of statutory rights, up to £30,000 of the combined amount is tax-free. Source: HMRC.` },
  ],
  'employer-ni-calculator': [
    { question: `What is the employer NI rate for 2026/27?`,  answer: `From 6 April 2026, the employer National Insurance rate increased from 13.8% to 15%, and the Secondary Threshold (the earnings point above which employer NI is charged) was reduced from £9,100 to £5,000 per year (£96.15/week). Combined, these changes significantly increase the cost of employment. For an employee earning £30,000, the employer NI cost went from 13.8% × (£30,000 − £9,100) = £2,884 to 15% × (£30,000 − £5,000) = £3,750 — an increase of £866 per employee per year. For employees earning £50,000, the increase is approximately £1,500. There is no upper earnings limit for employer NI — the 15% rate applies on all earnings above £5,000 with no cap. Unlike employee NI, employer NI is not charged on employees who have reached State Pension age (66). Source: HMRC.` },
    { question: `What is the Employment Allowance?`,  answer: `The Employment Allowance for 2026/27 is £10,500, allowing eligible employers to offset this amount against their employer NI liability each tax year. The allowance was increased from £5,000 to £10,500 from April 2025, coinciding with the increase in the employer NI rate. Crucially, the restriction that previously prevented single-director companies with no other employees from claiming was also removed from April 2025 — these businesses can now claim the full £10,500. The allowance is claimed in real time through your payroll software by setting the Employment Allowance indicator to Yes in the Employer Payment Summary (EPS). It cannot be used to reclaim NI already paid — it reduces future liability. Charities and community amateur sports clubs also qualify. Companies with employer NI bills of £100,000 or more in the previous tax year are not eligible. Source: HMRC (gov.uk/employment-allowance).` },
  ],
  'car-tax-calculator': [
    { question: `How is car tax (VED) calculated?`,  answer: `Vehicle Excise Duty (VED) for cars first registered on or after 1 April 2017 has two components: a first-year rate based on CO2 emissions, and a standard annual rate from year 2 onwards. First-year rates range from £0 for zero-emission vehicles to £5,490 for cars emitting over 255g/km. The standard annual rate for cars in year 2+ is £190 for most cars. Cars with a list price above £40,000 (including options) pay a £425 annual supplement for years 2–6, making the total £615/year for premium vehicles. For cars registered between 1 March 2001 and 31 March 2017, VED is still based on CO2 bands, ranging from free (band A, up to 100g/km) to £695/year (band M, over 255g/km). Classic cars (over 40 years old) are free. Source: DVLA (gov.uk/vehicle-tax-rate-tables).` },
    { question: `Do electric cars pay road tax?`,  answer: `From 1 April 2025, electric vehicles (EVs) are no longer exempt from Vehicle Excise Duty. New zero-emission cars registered on or after 1 April 2025 pay the lowest first-year rate (currently £10 for 2025) and then the standard annual rate of £190 from year 2 onwards. EVs registered between 1 April 2017 and 31 March 2025 also became liable for VED from 1 April 2025, paying the standard £190 annual rate. EVs registered before 1 April 2017 pay the rate applicable to their CO2 band, typically the lowest band. EVs with a list price above £40,000 are also subject to the £425 annual supplement for years 2–6, making the total £615/year. Plug-in hybrids (PHEVs) have been taxed under standard rates since 2017. The change ends an exemption that had been in place since 2001 and is expected to affect over 1 million registered EVs. Source: DVLA.` },
  ],
  'maternity-pay-calculator': [
    { question: `How long is Statutory Maternity Pay?`,  answer: `Statutory Maternity Pay (SMP) is payable for up to 39 weeks. The first 6 weeks are paid at 90% of your average weekly earnings (AWE) — there is no cap on this amount, so higher earners receive more in these weeks. The remaining 33 weeks are paid at the lower of the SMP flat rate (£194.32/week for 2026/27) or 90% of AWE — for most employees, this means the flat rate applies. SMP can start as early as 11 weeks before the expected week of childbirth. It is taxable and subject to National Insurance in the normal way. Employers can reclaim 92% of SMP paid from HMRC via PAYE; small employers (annual NI liability under £45,000) can reclaim 103%, covering their administration costs. Maternity Allowance (£194.32/week for 2026/27) is available to those who do not qualify for SMP, including self-employed mothers and those who have recently changed jobs. Source: HMRC, GOV.UK.` },
    { question: `When should I tell my employer I am pregnant?`,  answer: `You must notify your employer of your pregnancy and intended start date for maternity leave at least 15 weeks before your Expected Week of Childbirth (EWC). This is called the qualifying week and usually falls around week 25 of pregnancy. You should provide your employer with a MATB1 certificate, issued by your midwife or GP after the 20th week of pregnancy, as evidence of your due date. Telling your employer earlier (which many people choose to do for health and safety reasons) does not affect your rights. After receiving your notice, your employer must write to you within 28 days confirming your maternity leave start and end dates. You have the right to change your leave start date with at least 28 days' notice. It is unlawful for an employer to dismiss you or treat you less favourably because you are pregnant or on maternity leave. Source: GOV.UK (gov.uk/maternity-pay-leave).` },
  ],
  'mortgage-overpayment-calculator': [
    { question: `How much can I overpay on my mortgage?`,  answer: `Most UK mortgage lenders allow you to overpay up to 10% of your outstanding mortgage balance per year without incurring Early Repayment Charges (ERCs). This limit typically resets on 1 January each year, and any unused allowance does not carry forward. For example, on a £200,000 outstanding balance, you could overpay up to £20,000 per year penalty-free. Some lenders set different limits — certain trackers and standard variable rate (SVR) mortgages allow unlimited overpayments, while others cap monthly overpayments at a fixed amount such as £500. Always check your mortgage offer document or call your lender before making a large overpayment. Overpayments reduce the outstanding capital immediately, cutting both the remaining term and future interest charges. On a £200,000 mortgage at 4.5% with 20 years remaining, a £5,000 overpayment saves approximately £8,000 in total interest and cuts the term by around 8 months. Source: FCA, individual lenders.` },
    { question: `Is it better to overpay my mortgage or save?`,  answer: `The financially optimal choice depends primarily on whether your mortgage rate is higher or lower than your after-tax savings rate. If your mortgage rate is 4.5% and your best easy-access savings account pays 5% gross (4% after 20% tax for a basic-rate payer), saving beats overpaying by 0.5% per year. However, if your savings interest is taxed at 40% (a higher-rate taxpayer with a £500 PSA), the after-tax savings return drops to 3%, making overpaying more valuable. Other factors: emergency fund adequacy (you cannot re-borrow overpayments without remortgaging on most deals), investment alternatives such as S&S ISAs (historically ~7% real return), and psychological security. A hybrid approach — maintaining a cash buffer of 3–6 months' expenses while overpaying any surplus — balances financial efficiency against liquidity. Paying off higher-interest unsecured debts (credit cards, personal loans) before overpaying a mortgage is almost always the right priority. Source: FCA Money and Pensions Service.` },
  ],
  'universal-credit-calculator': [
    { question: `Who is eligible for Universal Credit?`,  answer: `You may be eligible for Universal Credit if you are aged 18 or over (some 16–17 year olds qualify in specific circumstances), under State Pension age, resident in the UK, not in full-time education unless you have children or a disability, and have savings and capital of less than £16,000. If you have between £6,000 and £16,000 in savings, your UC award is reduced by £4.35 per month for every £250 of capital above £6,000. UC replaces six legacy benefits: Working Tax Credit, Child Tax Credit, Housing Benefit, Income Support, income-based Jobseeker\'s Allowance, and income-related Employment and Support Allowance. If you are already on one of these benefits, you will be migrated to UC through the DWP\'s managed migration process, receiving a Transitional Protection payment if your UC entitlement would otherwise be lower. Source: DWP (gov.uk/universal-credit).` },
    { question: `How is Universal Credit calculated?`,  answer: `Universal Credit is calculated by starting with a maximum award based on standard amounts and applicable elements, then deducting a portion of your income. The Standard Allowance is £400.14/month (single, 25+) or £628.10/month (joint claimants, at least one 25+). Additional elements are added for children (£315.00/month first child born from April 2017; £269.58/month additional children), childcare (up to 85% of eligible costs), housing (Local Housing Allowance or rent-matched for social housing), limited capability for work (£156.11–£416.19/month depending on health assessment outcome), and caring (£198.31/month). From this maximum, income taper applies: 55p is deducted for every £1 of net earnings above the Work Allowance (£404/month with housing element; £673/month without). Non-employment income such as pensions reduces UC pound-for-pound. Source: DWP (gov.uk/universal-credit), April 2026 rates.` },
  ],
  'compound-interest-calculator': [
    { question: `What is compound interest?`,  answer: `Compound interest is interest calculated not only on the initial principal but also on all previously accumulated interest — meaning your money grows at an exponential rather than linear rate. In contrast, simple interest is calculated on the original principal only. For example, £10,000 invested at 5% per year simple interest grows to £15,000 after 10 years (£500/year). With annual compounding at 5%, the same amount grows to £16,289 — an extra £1,289 purely from reinvesting returns. The effect accelerates over time: after 30 years, simple interest gives £25,000 while compound gives £43,219. Albert Einstein is often (incorrectly) attributed with calling compound interest the eighth wonder of the world, but the principle is fundamental to how savings accounts, pensions, and investment funds grow. Monthly compounding grows faster than annual: £10,000 at 5% compounded monthly for 10 years becomes £16,470. Source: ONS, FCA.` },
    { question: `How often is interest compounded?`,  answer: `Interest compounding frequency varies by product. UK current accounts and easy-access savings accounts typically compound monthly or annually. Cash ISAs usually compound annually. Premium Bonds have prizes drawn monthly which is effectively monthly compounding if reinvested. Stocks and Shares ISAs reinvest dividends as new units, creating an organic compounding effect. Fixed-rate bonds (such as 1-year, 2-year, 3-year fixed savers) often pay interest at maturity rather than during the term — this is effectively annual compounding for the first year but not compounding within the term. For a meaningful comparison: £10,000 at 5% over 5 years gives £12,763 with annual compounding, £12,834 with monthly compounding, and £12,840 with daily compounding. The difference between monthly and daily is small; the difference between annual and monthly becomes more significant at higher balances and longer periods. Source: FCA.` },
  ],

    'premium-bonds-calculator': [
    { question: `How do Premium Bonds work?`,  answer: `Premium Bonds are issued by NS&I (HM Treasury-backed). Instead of earning interest, your bonds enter a monthly prize draw. £1 = 1 bond. Min £25 holding, max £50,000 per person. Two £1m jackpot prizes plus 5+ million smaller prizes each month, ranging £25 to £1m, all tax-free. Withdraw any time at face value, 100% government-backed.` },
    { question: `What are realistic odds of winning?`,  answer: `Current 'prize rate' is 4.0% (2026). Odds per £1 bond per month: ~21,000:1. £50,000 holding has expected £2,000/year in prizes but high variance — many small holders win nothing for years. Two £1m jackpot prizes drawn monthly are certain to be paid out from the total pool.` },
    { question: `Premium Bonds vs Cash ISA?`,  answer: `Cash ISA: guaranteed 4.5% AER, tax-free up to £20k allowance. Premium Bonds: variable prizes averaging 4.0% tax-free, no annual contribution limit beyond £50k holding. For higher-rate taxpayers (Personal Savings Allowance £500) or additional-rate (£0 PSA), Premium Bonds win for savings above PSA. Basic-rate taxpayers usually prefer guaranteed Cash ISA.` },
  ],
  'fuel-cost-calculator': [
    { question: `What's the cost-per-mile formula?`,  answer: `Cost per mile = (fuel price ÷ mpg) × 4.546 (litres per gallon). At £1.45/litre × 4.546 = £6.59/gallon. With 40 mpg: 16.5p/mile. At 50 mpg: 13.2p/mile. At 30 mpg: 22p/mile. For business mileage, HMRC pays 45p/mile (first 10k) covering fuel + wear + insurance + tax.` },
    { question: `How is UK fuel price made up?`,  answer: `Pump price ~£1.45/litre petrol, ~£1.50/litre diesel. Breakdown: Fuel Duty 52.95p/litre (frozen since 2011), VAT 20% on (duty + base) ~25p/litre, wholesale fuel cost 50-55p, retailer margin 7-10p. Total tax: ~75-80p per litre (50-55%). UK has among Europe's highest fuel taxes.` },
    { question: `EV vs petrol running cost.`,  answer: `Home charging (Octopus Go 7-9p/kWh): EV at 4 mi/kWh = 2p/mile. Petrol at 40 mpg + £1.45/litre = 16.5p/mile. Saving on 10,000 miles/year: ~£1,450. Public rapid charging (45-80p/kWh) raises EV cost to 11-20p/mile. Plus EV saves on servicing (fewer parts, no oil, less brake wear from regen).` },
  ],
  'energy-bill-calculator': [
    { question: `How does the Ofgem price cap work?`,  answer: `Set quarterly (Jan/Apr/Jul/Oct). Caps unit rates (p/kWh) and standing charges (p/day) for default tariff customers. Reflects wholesale energy costs (50-60%), networks (20-25%), policy costs (10-15%), supplier margin (3-5%). 2026 typical cap: electricity ~24p/kWh + 53p/day standing; gas ~6p/kWh + 32p/day standing. Average dual-fuel household pays £1,600-£1,800/year.` },
    { question: `Should I fix or stay on the cap?`,  answer: `Fixed deals add 5-15% premium above current cap. Fix if cap RISES 20%+ during fix period — you win. If cap FALLS, you lose. Watch wholesale gas futures + Ofgem announcements. Fix when prices are stable/falling for certainty; stay on cap when prices are volatile but trending downward. Many savvy switchers re-fix every 12-18 months.` },
    { question: `Time-of-use tariffs and EVs.`,  answer: `Octopus Agile (half-hourly wholesale-tracked): 0-30p/kWh, can go negative on sunny windy days. Octopus Go (EV tariff): 7-9p/kWh between 00:30-05:30, ~30p/kWh peak. EV owners on Go save £600-£1,200/year vs flat-rate. Heat pump owners benefit similarly. Solar panel owners on TOU tariffs sell excess generation back at ~15-20p/kWh.` },
  ],

  // === Auto-generated FAQs for remaining calculators ===
  'scottish-income-tax-calculator': [
    { question: `What does the Scottish Income Tax Calculator do?`,  answer: `Calculate Scottish income tax with all 6 bands: Starter, Basic, Intermediate, Higher, Advanced and Top rate for 2026/27.` },
    { question: `Is this calculator updated for the 2026/27 tax year?`,  answer: `Yes. This calculator uses the latest HMRC rates and thresholds for the 2026/27 UK tax year, which runs from 6 April 2026 to 5 April 2026. Rates are verified against official HMRC publications.` },
    { question: `Do I need to tell HMRC about this?`,  answer: `Whether you need to report to HMRC depends on your individual circumstances. If you are unsure, check GOV.UK or contact HMRC directly. This calculator provides estimates for guidance only.` },
  ],
  'stamp-duty-first-time-buyer-calculator': [
    { question: `What does the Stamp Duty First-Time Buyer Calculator do?`,  answer: `Calculate stamp duty relief for first-time buyers in England and Northern Ireland. Updated April 2025.` },
    { question: `Is this calculator updated for the 2026/27 tax year?`,  answer: `Yes. This calculator uses the latest HMRC rates and thresholds for the 2026/27 UK tax year, which runs from 6 April 2026 to 5 April 2026. Rates are verified against official HMRC publications.` },
    { question: `Do I need to tell HMRC about this?`,  answer: `Whether you need to report to HMRC depends on your individual circumstances. If you are unsure, check GOV.UK or contact HMRC directly. This calculator provides estimates for guidance only.` },
  ],
  'marriage-allowance-calculator': [
    { question: `What does the Marriage Allowance Calculator do?`,  answer: `Check if you can save up to £252 per year by transferring part of your Personal Allowance to your spouse or civil partner.` },
    { question: `Is this calculator updated for the 2026/27 tax year?`,  answer: `Yes. This calculator uses the latest HMRC rates and thresholds for the 2026/27 UK tax year, which runs from 6 April 2026 to 5 April 2026. Rates are verified against official HMRC publications.` },
    { question: `Do I need to tell HMRC about this?`,  answer: `Whether you need to report to HMRC depends on your individual circumstances. If you are unsure, check GOV.UK or contact HMRC directly. This calculator provides estimates for guidance only.` },
  ],
  'company-car-tax-calculator': [
    { question: `What does the Company Car Tax (BiK) Calculator do?`,  answer: `Calculate benefit-in-kind tax on your company car based on list price, CO2 emissions and fuel type.` },
    { question: `Is this calculator updated for the 2026/27 tax year?`,  answer: `Yes. This calculator uses the latest HMRC rates and thresholds for the 2026/27 UK tax year, which runs from 6 April 2026 to 5 April 2026. Rates are verified against official HMRC publications.` },
    { question: `Do I need to tell HMRC about this?`,  answer: `Whether you need to report to HMRC depends on your individual circumstances. If you are unsure, check GOV.UK or contact HMRC directly. This calculator provides estimates for guidance only.` },
  ],
  'crypto-tax-calculator': [
    { question: `What does the Crypto Tax Calculator UK do?`,  answer: `Calculate capital gains tax on cryptocurrency disposals including Bitcoin, Ethereum and other digital assets.` },
    { question: `Is this calculator updated for the 2026/27 tax year?`,  answer: `Yes. This calculator uses the latest HMRC rates and thresholds for the 2026/27 UK tax year, which runs from 6 April 2026 to 5 April 2026. Rates are verified against official HMRC publications.` },
    { question: `Do I need to tell HMRC about this?`,  answer: `Whether you need to report to HMRC depends on your individual circumstances. If you are unsure, check GOV.UK or contact HMRC directly. This calculator provides estimates for guidance only.` },
  ],
  'hourly-to-salary-calculator': [
    { question: `What does the Hourly to Annual Salary Calculator do?`,  answer: `Convert your hourly rate to an annual salary, or find out what your salary works out to per hour.` },
    { question: `Is this calculator based on 2026/27 rates?`,  answer: `Yes. This calculator uses the current 2026/27 UK tax year rates for income tax, National Insurance and other deductions, effective from 6 April 2026.` },
    { question: `Does this include pension contributions?`,  answer: `This calculator can factor in workplace pension contributions. Under auto-enrolment, the minimum is 8% total (5% employee + 3% employer) of qualifying earnings.` },
  ],
  'employer-cost-calculator': [
    { question: `What does the Employer Cost Calculator do?`,  answer: `Calculate the total cost of employing someone including salary, employer NI (15%), pension contributions and apprenticeship levy.` },
    { question: `Is this calculator based on 2026/27 rates?`,  answer: `Yes. This calculator uses the current 2026/27 UK tax year rates for income tax, National Insurance and other deductions, effective from 6 April 2026.` },
    { question: `Does this include pension contributions?`,  answer: `This calculator can factor in workplace pension contributions. Under auto-enrolment, the minimum is 8% total (5% employee + 3% employer) of qualifying earnings.` },
  ],
  'bonus-tax-calculator': [
    { question: `What does the Bonus Tax Calculator do?`,  answer: `Calculate how much of your bonus you will take home after income tax and National Insurance deductions.` },
    { question: `Is this calculator based on 2026/27 rates?`,  answer: `Yes. This calculator uses the current 2026/27 UK tax year rates for income tax, National Insurance and other deductions, effective from 6 April 2026.` },
    { question: `Does this include pension contributions?`,  answer: `This calculator can factor in workplace pension contributions. Under auto-enrolment, the minimum is 8% total (5% employee + 3% employer) of qualifying earnings.` },
  ],
  'rental-yield-calculator': [
    { question: `What does the Rental Yield Calculator do?`,  answer: `Calculate gross and net rental yield on buy-to-let investment properties.` },
    { question: `Is this based on current interest rates?`,  answer: `You can enter any interest rate to model different scenarios. Check the Bank of England base rate and current mortgage deals from lenders for the latest rates.` },
    { question: `Should I get professional advice?`,  answer: `This calculator provides estimates for guidance only. For a formal mortgage offer, speak to a mortgage broker or lender who can assess your full circumstances and provide personalised advice.` },
  ],
  'rent-vs-buy-calculator': [
    { question: `What does the Rent vs Buy Calculator do?`,  answer: `Compare the financial costs of renting versus buying a property over time in the UK.` },
    { question: `Is this based on current interest rates?`,  answer: `You can enter any interest rate to model different scenarios. Check the Bank of England base rate and current mortgage deals from lenders for the latest rates.` },
    { question: `Should I get professional advice?`,  answer: `This calculator provides estimates for guidance only. For a formal mortgage offer, speak to a mortgage broker or lender who can assess your full circumstances and provide personalised advice.` },
  ],
  'state-pension-calculator': [
    { question: `What does the State Pension Calculator do?`,  answer: `Estimate your UK State Pension based on your National Insurance record. Full new State Pension is £230.25 per week.` },
    { question: `Are these figures guaranteed?`,  answer: `No. Pension projections are estimates based on assumed growth rates and current contribution levels. Actual returns depend on investment performance, fees and future policy changes.` },
    { question: `What is the pension annual allowance?`,  answer: `The pension annual allowance for 2026/27 is £60,000. This is the maximum you can contribute (including employer contributions) and receive tax relief. The allowance is tapered for high earners.` },
  ],
  'pension-tax-relief-calculator': [
    { question: `What does the Pension Tax Relief Calculator do?`,  answer: `Calculate how much tax relief you get on pension contributions as a basic, higher or additional rate taxpayer.` },
    { question: `Are these figures guaranteed?`,  answer: `No. Pension projections are estimates based on assumed growth rates and current contribution levels. Actual returns depend on investment performance, fees and future policy changes.` },
    { question: `What is the pension annual allowance?`,  answer: `The pension annual allowance for 2026/27 is £60,000. This is the maximum you can contribute (including employer contributions) and receive tax relief. The allowance is tapered for high earners.` },
  ],
  'isa-calculator': [
    { question: `What does the ISA Calculator — Tax-Free Savings Growth do?`,  answer: `Calculate your tax-free ISA savings growth with the £20,000 annual allowance. Compare Cash ISA and Stocks & Shares ISA.` },
    { question: `Is this calculator suitable for financial decisions?`,  answer: `This calculator provides estimates for guidance only. Investment returns are not guaranteed and your capital is at risk. Consider seeking independent financial advice before making investment decisions.` },
    { question: `Are ISA contributions tax-free?`,  answer: `Yes. The annual ISA allowance for 2026/27 is £20,000. Any interest, dividends or capital gains within an ISA are completely tax-free.` },
  ],
  'personal-loan-calculator': [
    { question: `What is "representative APR" and why might I be offered a higher rate?`,  answer: `Under FCA CONC 3.5, lenders only have to offer the advertised "representative APR" to 51% of accepted applicants. The other 49% can be offered a higher personalised rate based on credit score, income, debt-to-income ratio and loan purpose. Always do a soft search via Experian, Clearscore or MoneySavingExpert's eligibility tool before applying — hard searches damage your credit score even if rejected.` },
    { question: `Is it better to take a longer loan term to lower monthly payments?`,  answer: `Longer terms reduce monthly cost but dramatically increase total interest. A £10,000 loan at 8% APR costs £203/month over 5 years (£2,166 interest) vs £121/month over 10 years (£4,557 interest) — more than double the interest for half the monthly saving. Use the shortest term you can comfortably afford. The FCA Persistent Debt rules also penalise you for staying in expensive credit for too long.` },
    { question: `Can I repay a UK personal loan early?`,  answer: `Yes. Under the Consumer Credit Act 1974, you can settle a personal loan early at any time. Lenders can charge an early settlement fee of up to 1 month's interest (28 days for loans under 12 months remaining; 58 days otherwise). For loans of £8,000+, the early settlement charge is capped at 1% of the amount repaid. For most borrowers, early repayment still saves substantial interest.` },
    { question: `Personal loan vs 0% credit card vs overdraft — which is cheapest?`,  answer: `For one-off purchases under £5,000 paid back within 18-24 months, a 0% purchase credit card is usually cheapest (interest-free if cleared before promo ends). For £5,000+ over 2-7 years, personal loans typically win. Authorised overdrafts have been required to charge a single APR since April 2020 and are usually the most expensive at 35-40% EAR — only use for short emergencies, not planned borrowing.` },
    { question: `Should I get professional debt advice?`,  answer: `If repayments would exceed 30% of your take-home pay, or you are using new credit to repay old debt, contact free debt charities: StepChange (0800 138 1111), National Debtline (0808 808 4000) or Citizens Advice. They can negotiate with creditors, arrange Debt Management Plans or advise on IVAs/bankruptcy. This calculator gives estimates only and is not a substitute for personalised advice.` },
  ],
  'credit-card-repayment-calculator': [
    { question: `Why does paying only the minimum cost so much more?`,  answer: `Minimum payments are typically 1% of balance plus interest (or £5, whichever is higher). On a £3,000 balance at 22.9% APR, the minimum starts around £62/month but takes 24+ years to clear, costing £4,800+ in interest. Doubling the minimum cuts payoff to ~7 years and total interest to ~£1,400. The FCA Persistent Debt Rules require card issuers to escalate help if you pay more in interest/fees than principal over 18 months — but the smartest move is to clear balances faster than the minimum.` },
    { question: `Should I do a balance transfer to a 0% card?`,  answer: `If you have good credit and can clear the balance during the 0% period (commonly 18-30 months), balance transfers can save hundreds in interest. Watch for the transfer fee (typically 2.5-3.5% upfront), then divide balance by the 0% months to ensure your monthly payment will clear it before the promotional rate ends. Don't spend on the new card — purchases usually attract standard purchase APR immediately.` },
    { question: `What is Section 75 protection?`,  answer: `Section 75 of the Consumer Credit Act 1974 makes credit card issuers jointly liable with retailers for purchases between £100 and £30,000 made on the card. If goods are faulty, the retailer goes bust, or services aren't delivered, you can claim the full amount back from your card issuer. This is one of the strongest UK consumer protections and a key reason to use credit cards for expensive purchases (then pay in full from your current account).` },
    { question: `How does credit utilisation affect my credit score?`,  answer: `Credit utilisation (balance ÷ credit limit) is one of the top factors in your score. Below 30% is generally good; below 10% is excellent. Maxing out a card — even temporarily — can drop your score by 50-100 points. If you have a £5,000 limit, keep balances under £1,500. Multiple cards can help by spreading utilisation, but only if you manage them all responsibly.` },
    { question: `What happens if I miss a credit card payment?`,  answer: `One missed payment typically results in a £12 late fee and a record on your credit file (visible for 6 years). The card may also be moved to the standard APR if you were on a promotional rate. Two consecutive missed payments mark the account as in arrears; six months of missed payments leads to default and likely debt collection. Always call your provider immediately — most will offer a payment break or repayment plan if you act before missing payments.` },
  ],
  'sole-trader-tax-calculator': [
    { question: `What does the Sole Trader Tax Calculator do?`,  answer: `Calculate income tax and Class 4 NI for sole traders and self-employed individuals.` },
    { question: `How does sole trader tax differ from PAYE?`,  answer: `As a sole trader you pay tax on profits (revenue minus allowable expenses), not gross income. You file once a year via Self Assessment by 31 January, with Payments on Account due 31 January and 31 July if your bill exceeds £1,000. PAYE employees have tax deducted automatically each pay period. Sole traders also pay Class 4 NI at 6%/2% (Class 2 was abolished April 2024) instead of Class 1's 8%/2%.` },
    { question: `What expenses can a sole trader claim?`,  answer: `Allowable business expenses include: office costs (rent, business rates, stationery, phone), travel (mileage at 45p/25p HMRC rates, train, parking but NOT regular commute), clothing (uniforms only, not normal clothes), staff costs, things you buy to sell, financial costs (insurance, bank charges), business premises rates and utilities, marketing and entertainment (clients only). Use of home as office can be claimed via the £6/week simplified method or actual proportional costs.` },
    { question: `Do I need to register for VAT?`,  answer: `VAT registration is compulsory once your taxable turnover exceeds £90,000 (2026/27) in any rolling 12 months. Voluntary registration below this can be beneficial if your customers are VAT-registered (they reclaim input VAT) or if you make zero-rated supplies. Once registered, you charge VAT on sales and reclaim VAT on purchases. The Flat Rate Scheme simplifies this for small businesses with turnover under £150,000.` },

  ],
  'ir35-calculator': [
    { question: `What does the IR35 Take-Home Pay Calculator do?`,  answer: `Compare your take-home pay inside and outside IR35 as a contractor working through a limited company.` },
    { question: `How is IR35 status determined?`,  answer: `HMRC and tribunals use three primary tests: (1) Control — does the client direct how, when, and where you work; (2) Substitution — could you send a substitute, and is this a genuine right; (3) Mutuality of obligation — is the client obliged to offer work and you obliged to accept. Other factors include financial risk, equipment ownership, integration into the business, and exclusivity. Use HMRC's CEST tool for an initial check, but get a contract review from a specialist (e.g. Qdos, Bauer & Cottrell) for borderline cases.` },
    { question: `Who decides IR35 status — me or my client?`,  answer: `Since April 2021 (private sector) and 2017 (public sector), medium and large clients determine IR35 status and issue a Status Determination Statement (SDS). They become liable for unpaid tax if they assess incorrectly. Small clients (turnover under £10.2m, balance sheet under £5.1m, fewer than 50 employees — meeting 2 of 3) are exempt — in this case YOU as contractor determine status. The April 2024 'offset' rules let HMRC offset tax already paid by the contractor against the employer's bill.` },
    { question: `Inside IR35 — what does this mean financially?`,  answer: `Inside IR35 means HMRC treats you as a 'deemed employee' of the client for tax purposes. Your fee is taxed via PAYE + employee NI by the fee-payer (usually the agency or end client), and you receive net pay similar to an umbrella worker. You lose the ability to take dividends, claim travel/subsistence (unless covered by SDC rules), or use the Annual Investment Allowance. Inside IR35 typically costs contractors 20-25% of gross income compared to outside.` },

  ],
  'dividend-vs-salary-calculator': [
    { question: `What does the Dividend vs Salary Calculator do?`,  answer: `Find the most tax-efficient mix of salary and dividends for limited company directors.` },
    { question: `Why do many company directors take a small salary plus dividends?`,  answer: `Salary up to the Personal Allowance (£12,570) uses no income tax. Salary above the Secondary Threshold (£5,000 in 2026/27) attracts 15% employer NI, but the salary itself is tax-deductible against Corporation Tax. Dividends after the first £500 are taxed at 8.75%/33.75%/39.35% — lower than equivalent income tax bands — and don't trigger NI. The optimal split for many directors: salary at the PA (or Secondary Threshold if claiming Employment Allowance), rest as dividends.` },
    { question: `Can my company pay any dividend amount?`,  answer: `No. Dividends can only be paid from distributable profits (post-tax retained earnings). You cannot pay dividends if doing so would make the company insolvent. Improper dividends are 'unlawful' and can be reclaimed personally by liquidators in case of insolvency. Always record dividend declarations in board minutes and issue tax vouchers. HMRC may treat 'dividends' from a company without distributable profits as salary or director's loans.` },
    { question: `How does Employment Allowance change the salary calculation?`,  answer: `Employment Allowance (£10,500 for 2026/27) reduces employer NI bills. To claim, you need at least one employee other than the director (or two directors). Sole-director companies cannot claim. With Employment Allowance, paying a £12,570 salary becomes tax-neutral for the company (£1,135 employer NI on the slice over £5,000 is covered by EA). Without it, the optimal salary drops to £5,000 (the secondary threshold) to avoid employer NI.` },

  ],
  'calorie-calculator': [
    { question: `What does the Calorie Calculator (TDEE) do?`,  answer: `Calculate your Total Daily Energy Expenditure and recommended calorie intake for weight loss, maintenance or gain.` },
    { question: `How many calories do I need per day?`,  answer: `UK government recommendations: women 2,000 kcal, men 2,500 kcal — but actual needs vary by age, weight, height, activity. This calculator uses the Mifflin-St Jeor equation (most accurate for general adults): BMR = (10 × weight kg) + (6.25 × height cm) − (5 × age) + 5 (men) or −161 (women), then multiplied by activity factor (1.2 sedentary to 1.9 very active). Athletes and pregnant women have different needs.` },
    { question: `Should I count calories to lose weight?`,  answer: `Sustained calorie deficit of 500-750 kcal/day produces 0.5-0.75 kg weight loss per week — NHS recommends not exceeding 1 kg/week. Counting calories works for some but isn't necessary — meal portion control, increased protein/fibre, removing ultra-processed foods often work better long-term. NHS advises minimum 1,500 kcal/day for women and 1,800 kcal/day for men under sustained low-calorie diets — below this, get medical supervision.` },
    { question: `What's the difference between BMR and TDEE?`,  answer: `BMR (Basal Metabolic Rate) is what your body burns at complete rest — keeps organs functioning, brain working, temperature maintained. Typically 1,400-1,800 kcal/day for adults. TDEE (Total Daily Energy Expenditure) = BMR × activity multiplier. Includes exercise, walking, fidgeting (NEAT), and digesting food (TEF, ~10% of intake). For weight maintenance, eat TDEE; for loss, eat 15-25% below TDEE; for gain, 10-20% above.` },

  ],
  'concrete-calculator': [
    { question: `What does the Concrete Calculator do?`,  answer: `Calculate how much concrete you need in cubic metres or bags for slabs, footings, posts and columns.` },
    { question: `Does this include waste allowance?`,  answer: `Yes. Most building material calculations include a standard 10% waste allowance. You can adjust this figure depending on the complexity of your project and cutting requirements.` },
    { question: `Are prices accurate?`,  answer: `Material prices are indicative estimates based on average UK prices. Actual costs vary by region, supplier, brand and current market conditions. Always get quotes from local suppliers.` },
  ],
  'paint-calculator': [
    { question: `What does the Paint Calculator — Litres & Coverage do?`,  answer: `Calculate how much paint you need based on wall area, number of coats and paint coverage rate.` },
    { question: `Does this include waste allowance?`,  answer: `Yes. Most building material calculations include a standard 10% waste allowance. You can adjust this figure depending on the complexity of your project and cutting requirements.` },
    { question: `Are prices accurate?`,  answer: `Material prices are indicative estimates based on average UK prices. Actual costs vary by region, supplier, brand and current market conditions. Always get quotes from local suppliers.` },
  ],
  'percentage-calculator': [
    { question: `What does the Percentage Calculator do?`,  answer: `Calculate percentages, percentage increase/decrease, and find what percentage one number is of another.` },
    { question: `How to calculate percentage changes.`,  answer: `Percentage change = ((new value - old value) ÷ old value) × 100. £100 → £120 = (20/100) × 100 = +20%. £120 → £100 = -16.7% (not -20% — common mistake). To reverse: £100 increased by 20% = £120, but to reverse from £120 back to £100 requires -16.7% decrease. The asymmetry is why % gains and losses aren't reciprocal — a 50% loss requires a 100% gain to recover.` },
    { question: `Adding/subtracting VAT, discount, and tax.`,  answer: `Add 20% VAT: multiply by 1.20. Remove 20% VAT: divide by 1.20. The VAT portion of a gross amount = divide by 6 (because 20/120 = 1/6). 25% discount: multiply by 0.75 (i.e. 100% - 25%). Subsequent discounts compound: 25% off then 10% off = 0.75 × 0.90 = 0.675 (32.5% off total), NOT 35%. Always apply percentages multiplicatively when chained, not additively.` },
    { question: `Compound percentage growth.`,  answer: `(1 + rate)^periods. £10,000 at 5% over 10 years = £10,000 × (1.05)^10 = £16,289. Each year's gain becomes part of the next year's base — exponential growth. Approximation: years to double = 72 ÷ rate (Rule of 72). 5% annual return doubles money in 14 years; 10% doubles in 7 years. Real-world: UK equity index averaged 7% inflation-adjusted from 1900-2025 — doubling roughly every 10 years.` },

  ],
  'age-calculator': [
    { question: `What does the Age Calculator — Years, Months & Days do?`,  answer: `Calculate your exact age in years, months and days from your date of birth.` },
    { question: `Is this calculator free to use?`,  answer: `Yes. All calculators on Calks.uk are completely free to use. No account or registration is required. All calculations run in your browser — no data is collected.` },
    { question: `Can I use this on my phone?`,  answer: `Yes. All our calculators are fully responsive and work on smartphones, tablets and desktop computers. The interface adapts to your screen size automatically.` },
  ],
  'currency-converter': [
    { question: `What does the Currency Converter — Live Exchange Rates do?`,  answer: `Convert between GBP, EUR, USD and 150+ world currencies with live exchange rates.` },
    { question: `Is this calculator free to use?`,  answer: `Yes. All calculators on Calks.uk are completely free to use. No account or registration is required. All calculations run in your browser — no data is collected.` },
    { question: `Can I use this on my phone?`,  answer: `Yes. All our calculators are fully responsive and work on smartphones, tablets and desktop computers. The interface adapts to your screen size automatically.` },
  ],
  'discount-calculator': [
    { question: `What does the Discount Calculator do?`,  answer: `Calculate sale prices, savings and reverse percentage discounts instantly.` },
    { question: `Is this calculator free to use?`,  answer: `Yes. All calculators on Calks.uk are completely free to use. No account or registration is required. All calculations run in your browser — no data is collected.` },
    { question: `Can I use this on my phone?`,  answer: `Yes. All our calculators are fully responsive and work on smartphones, tablets and desktop computers. The interface adapts to your screen size automatically.` },
  ],
  'tip-calculator': [
    { question: `What does the Tip Calculator — Restaurant & Service Tips do?`,  answer: `Calculate tips and split bills between multiple people. Choose your tip percentage.` },
    { question: `Is this calculator free to use?`,  answer: `Yes. All calculators on Calks.uk are completely free to use. No account or registration is required. All calculations run in your browser — no data is collected.` },
    { question: `Can I use this on my phone?`,  answer: `Yes. All our calculators are fully responsive and work on smartphones, tablets and desktop computers. The interface adapts to your screen size automatically.` },
  ],
  'vat-flat-rate-calculator': [
    { question: `What does the VAT Flat Rate Scheme Calculator do?`,  answer: `Compare VAT Flat Rate Scheme vs standard VAT for your business sector. See if you save or lose.` },
    { question: `Is this calculator updated for the 2026/27 tax year?`,  answer: `Yes. This calculator uses the latest HMRC rates and thresholds for the 2026/27 UK tax year, which runs from 6 April 2026 to 5 April 2026. Rates are verified against official HMRC publications.` },
    { question: `Do I need to tell HMRC about this?`,  answer: `Whether you need to report to HMRC depends on your individual circumstances. If you are unsure, check GOV.UK or contact HMRC directly. This calculator provides estimates for guidance only.` },
  ],
  'flooring-calculator': [
    { question: `What does the Flooring Calculator do?`,  answer: `Calculate how much laminate, vinyl or carpet you need including wastage. Get pack and cost estimates.` },
    { question: `Does this include waste allowance?`,  answer: `Yes. Most building material calculations include a standard 10% waste allowance. You can adjust this figure depending on the complexity of your project and cutting requirements.` },
    { question: `Are prices accurate?`,  answer: `Material prices are indicative estimates based on average UK prices. Actual costs vary by region, supplier, brand and current market conditions. Always get quotes from local suppliers.` },
  ],
  'tile-calculator': [
    { question: `What does the Tile Calculator — Tiles Needed & Cost do?`,  answer: `Calculate how many tiles you need for walls or floors. Accounts for grout gaps and wastage.` },
    { question: `Does this include waste allowance?`,  answer: `Yes. Most building material calculations include a standard 10% waste allowance. You can adjust this figure depending on the complexity of your project and cutting requirements.` },
    { question: `Are prices accurate?`,  answer: `Material prices are indicative estimates based on average UK prices. Actual costs vary by region, supplier, brand and current market conditions. Always get quotes from local suppliers.` },
  ],
  'gravel-calculator': [
    { question: `What does the Gravel Calculator — Tonnes & Cost do?`,  answer: `Calculate gravel needed in cubic metres, tonnes or bags for driveways, paths and landscaping.` },
    { question: `Does this include waste allowance?`,  answer: `Yes. Most building material calculations include a standard 10% waste allowance. You can adjust this figure depending on the complexity of your project and cutting requirements.` },
    { question: `Are prices accurate?`,  answer: `Material prices are indicative estimates based on average UK prices. Actual costs vary by region, supplier, brand and current market conditions. Always get quotes from local suppliers.` },
  ],
  'wallpaper-calculator': [
    { question: `What does the Wallpaper Calculator do?`,  answer: `Calculate how many rolls of wallpaper you need. Accounts for pattern repeat and doors/windows.` },
    { question: `Does this include waste allowance?`,  answer: `Yes. Most building material calculations include a standard 10% waste allowance. You can adjust this figure depending on the complexity of your project and cutting requirements.` },
    { question: `Are prices accurate?`,  answer: `Material prices are indicative estimates based on average UK prices. Actual costs vary by region, supplier, brand and current market conditions. Always get quotes from local suppliers.` },
  ],
  'decking-calculator': [
    { question: `What does the Decking Calculator — Boards & Cost do?`,  answer: `Calculate decking boards, joists and screws needed. Get material cost estimates.` },
    { question: `Does this include waste allowance?`,  answer: `Yes. Most building material calculations include a standard 10% waste allowance. You can adjust this figure depending on the complexity of your project and cutting requirements.` },
    { question: `Are prices accurate?`,  answer: `Material prices are indicative estimates based on average UK prices. Actual costs vary by region, supplier, brand and current market conditions. Always get quotes from local suppliers.` },
  ],
  'fencing-calculator': [
    { question: `What does the Fencing Calculator — Panels & Cost do?`,  answer: `Calculate fence panels and posts needed for your garden fence with material cost estimates.` },
    { question: `Does this include waste allowance?`,  answer: `Yes. Most building material calculations include a standard 10% waste allowance. You can adjust this figure depending on the complexity of your project and cutting requirements.` },
    { question: `Are prices accurate?`,  answer: `Material prices are indicative estimates based on average UK prices. Actual costs vary by region, supplier, brand and current market conditions. Always get quotes from local suppliers.` },
  ],
  'body-fat-calculator': [
    { question: `What does the Body Fat Percentage Calculator do?`,  answer: `Estimate your body fat percentage using the US Navy method with waist, neck and hip measurements.` },
    { question: `How does the Navy body fat method work?`,  answer: `The US Navy formula estimates body fat from waist, neck, and (for women) hip circumference, height, and gender. It's free, requires only a tape measure, and is ~3-4% accurate compared to DEXA scans (the gold standard). Men: 86.010 × log10(waist − neck) − 70.041 × log10(height) + 36.76. Women: 163.205 × log10(waist + hip − neck) − 97.684 × log10(height) − 78.387. Most accurate for adults aged 18-50; less reliable for highly muscular individuals.` },
    { question: `What body fat % is healthy?`,  answer: `ACSM and NHS general guidelines — Men: 6-13% athletes, 14-17% fit, 18-24% acceptable, 25%+ obese. Women: 14-20% athletes, 21-24% fit, 25-31% acceptable, 32%+ obese. Body fat distribution matters too: visceral (around organs) is more dangerous than subcutaneous. Waist circumference >94cm (men) or >80cm (women) indicates raised health risk regardless of BMI or body fat %.` },
    { question: `Body fat % vs BMI — which is better?`,  answer: `Both are screening tools with limitations. BMI is faster (just height + weight) but doesn't distinguish muscle from fat — a muscular rugby player and an obese person can have the same BMI. Body fat % is more meaningful for athletic individuals but harder to measure accurately. The most reliable: DEXA scan (~£100, gives bone density too), then BIA (bioelectrical impedance — most home scales), then skinfold callipers, then Navy/Jackson-Pollock formulas, then BMI. Use multiple metrics together.` },

  ],
  'pregnancy-due-date-calculator': [
    { question: `What does the Pregnancy Due Date Calculator do?`,  answer: `Calculate your estimated due date from your last menstrual period. See key milestones and trimester progress.` },
    { question: `How is the due date calculated?`,  answer: `Standard Naegele's rule: add 280 days (40 weeks) to the first day of your last menstrual period (LMP). For example, LMP 1 January → due date ~8 October. This assumes a 28-day cycle and ovulation on day 14. If you know the conception date or have IVF transfer date, calculations are more precise. Ultrasound dating (especially crown-rump length at 8-13 weeks) is the most accurate method — used by NHS as the official due date if cycle length is irregular.` },
    { question: `Is my due date exact?`,  answer: `Only ~5% of babies arrive on the exact due date. About 60% are born within 7 days of due date; 90% within 2 weeks. 'Term' covers weeks 37-42. Babies arriving before 37 weeks are preterm; after 42 weeks are post-term and usually induced. First-time mothers are more likely to deliver after due date; women with previous births more likely to deliver close to or before due date.` },
    { question: `When should I tell people I'm pregnant?`,  answer: `Many women wait until after the 12-week scan (combined screening for chromosomal conditions) when miscarriage risk drops to <1%. Earlier disclosure to employer is legal protection — pregnancy discrimination is illegal under the Equality Act 2010. You must tell your employer at least 15 weeks before your due date (the 'qualifying week') to claim Statutory Maternity Leave and Pay. Maternity rights begin from week 1 of pregnancy.` },

  ],
  'alcohol-units-calculator': [
    { question: `What does the Alcohol Units Calculator do?`,  answer: `Calculate alcohol units in your drinks. Track against the NHS guideline of 14 units per week.` },
    { question: `What's the UK low-risk drinking guideline?`,  answer: `UK Chief Medical Officers' guidelines (2016, still current): no more than 14 units per week for both men and women, spread over 3+ days, with several alcohol-free days. 14 units = 6 pints of average strength beer or 10 small (125ml) glasses of low-strength wine, or 14 single (25ml) measures of spirits. Pregnant women are advised no alcohol. There's no completely 'safe' level — risks increase with consumption.` },
    { question: `How are alcohol units calculated?`,  answer: `Units = (ABV % × volume in ml) ÷ 1,000. A 175ml glass of 12% wine = (12 × 175) ÷ 1,000 = 2.1 units. A pint of 4% beer = (4 × 568) ÷ 1,000 = 2.27 units. A 25ml shot of 40% spirits = 1 unit. Modern wines are stronger (often 12.5-14% vs 'old' 11%), and pints often 4.5-5.5% — actual units can be 30-50% higher than rough estimates.` },
    { question: `What are the health risks of exceeding 14 units?`,  answer: `Above 14 units/week increases risks of: liver disease (cirrhosis, fatty liver), 7 types of cancer (bowel, breast, mouth, throat, oesophagus, liver, voice box), heart disease and stroke, mental health problems, and accidents. NHS estimates 80% of alcoholic liver disease occurs in people drinking above guidelines. Dependence develops gradually — symptoms include needing alcohol to function, drinking before noon, hiding consumption. Free help: Drinkline 0300 123 1110.` },

  ],
  'sleep-calculator': [
    { question: `What does the Sleep Calculator — Bedtime & Wake Time do?`,  answer: `Find the best bedtime or wake-up time based on 90-minute sleep cycles. Wake feeling refreshed.` },
    { question: `Why 90-minute sleep cycles?`,  answer: `Normal adult sleep cycles last 80-110 minutes (average 90), passing through stages: light sleep (N1, N2), deep sleep (N3, restorative), and REM (dreams, memory consolidation). Waking at the end of a cycle feels easier than mid-cycle. The 'sleep calculator' adds backward 90-minute increments to your alarm time. So if you must wake at 6:30am, ideal bedtimes are 9:00, 10:30, or midnight (allowing 15 min to fall asleep). Individual cycles vary — track over 2 weeks to find your personal pattern.` },
    { question: `How much sleep do adults really need?`,  answer: `NHS recommends 7-9 hours for adults. Genetic 'short sleepers' (1-3% of population) function on 6 hours; most people only think they're short sleepers but actually accumulate sleep debt. Teens need 8-10 hours; children 9-13 hours. Quality matters as much as duration — uninterrupted sleep in a cool (16-18°C), dark room is more restorative than 8 hours with multiple wakings. Chronic sleep <6 hours is linked to obesity, diabetes type 2, cardiovascular disease, and Alzheimer's risk.` },
    { question: `Sleep hygiene basics that actually work`,  answer: `Consistent wake time (even weekends) — anchor to the same wake time within 1 hour. Morning sunlight within 30 minutes of waking sets circadian rhythm. No caffeine after 2pm (half-life 5-6 hours). Cool bedroom (16-18°C). Wind-down routine 30-60 min before bed: dim lights, no screens (or use night mode at minimum). Alcohol disrupts REM and deep sleep — avoid within 3 hours of bed. CBT-I (Cognitive Behavioural Therapy for Insomnia) outperforms sleeping pills for chronic insomnia.` },

  ],
  'date-calculator': [
    { question: `What does the Date Calculator — Days Between Dates do?`,  answer: `Calculate the number of days, weeks and working days between two dates. Add or subtract days from a date.` },
    { question: `Is this calculator free to use?`,  answer: `Yes. All calculators on Calks.uk are completely free to use. No account or registration is required. All calculations run in your browser — no data is collected.` },
    { question: `Can I use this on my phone?`,  answer: `Yes. All our calculators are fully responsive and work on smartphones, tablets and desktop computers. The interface adapts to your screen size automatically.` },
  ],
  'weight-converter': [
    { question: `What does the Weight Converter (kg / stone / pounds) do?`,  answer: `Convert between kilograms, stone, pounds, ounces and tonnes. Includes UK stone & pounds display.` },
    { question: `Is this calculator free to use?`,  answer: `Yes. All calculators on Calks.uk are completely free to use. No account or registration is required. All calculations run in your browser — no data is collected.` },
    { question: `Can I use this on my phone?`,  answer: `Yes. All our calculators are fully responsive and work on smartphones, tablets and desktop computers. The interface adapts to your screen size automatically.` },
  ],
  'wedding-budget-calculator': [
    { question: `What does the Wedding Budget Calculator do?`,  answer: `Plan your wedding budget with a typical UK breakdown. See cost per guest and category allocations.` },
    { question: `Is this calculator free to use?`,  answer: `Yes. All calculators on Calks.uk are completely free to use. No account or registration is required. All calculations run in your browser — no data is collected.` },
    { question: `Can I use this on my phone?`,  answer: `Yes. All our calculators are fully responsive and work on smartphones, tablets and desktop computers. The interface adapts to your screen size automatically.` },
  ],
  'visa-points-calculator': [
    { question: `What does the UK Skilled Worker Visa Points Calculator do?`,  answer: `Check if you meet the 70-point threshold for a UK Skilled Worker visa. Calculate mandatory and tradeable points.` },
    { question: `Are visa fees up to date?`,  answer: `This calculator uses the current UK visa and immigration fees as published by UK Visas and Immigration (UKVI). Fees are reviewed periodically — check GOV.UK for the very latest amounts.` },
    { question: `Does this include the Immigration Health Surcharge?`,  answer: `Yes. The Immigration Health Surcharge (IHS) is included in the total cost calculation where applicable. The current IHS rate is £1,035 per year for most visa categories.` },
  ],
  'court-fee-calculator': [
    { question: `What does the Court Fee Calculator do?`,  answer: `Calculate court issue fees and hearing fees for money claims in England and Wales.` },
    { question: `Are court fees accurate?`,  answer: `This calculator uses the current UK court fee schedule. Fees are set by the Ministry of Justice and are reviewed periodically. Check GOV.UK for the very latest fee amounts.` },
    { question: `Do I need a solicitor?`,  answer: `Whether you need a solicitor depends on the complexity of your case. For straightforward matters you may be able to represent yourself, but for significant legal issues professional advice is recommended.` },
  ],
  'probate-fee-calculator': [
    { question: `What does the Probate Fee Calculator do?`,  answer: `Calculate probate application fees and estimated solicitor costs for administering an estate.` },
    { question: `Are court fees accurate?`,  answer: `This calculator uses the current UK court fee schedule. Fees are set by the Ministry of Justice and are reviewed periodically. Check GOV.UK for the very latest fee amounts.` },
    { question: `Do I need a solicitor?`,  answer: `Whether you need a solicitor depends on the complexity of your case. For straightforward matters you may be able to represent yourself, but for significant legal issues professional advice is recommended.` },
  ],
  'life-insurance-calculator': [
    { question: `What does the Life Insurance Needs Calculator do?`,  answer: `Calculate how much life insurance cover you need based on income, mortgage, debts and family costs.` },
    { question: `Are these actual quotes?`,  answer: `No. This calculator provides estimates based on typical UK insurance factors. Actual premiums depend on your specific circumstances. Always compare quotes from multiple insurers.` },
    { question: `Is insurance required by law?`,  answer: `Some insurance is legally required in the UK — such as motor insurance, employers\' liability insurance and buildings insurance (if you have a mortgage). Other types are optional but strongly recommended.` },
  ],
  'square-root-calculator': [
    { question: `What does the Square Root, Powers & Logarithm Calculator do?`,  answer: `Calculate square roots, cube roots, custom powers, and logarithms (log10, ln, log2).` },
    { question: `How accurate are the results?`,  answer: `This calculator uses standard mathematical algorithms and provides results accurate to the precision shown. For very large numbers or high-precision requirements, results are rounded to a reasonable number of decimal places.` },
    { question: `Can I use this for schoolwork?`,  answer: `Yes. This calculator is suitable for GCSE, A-level and university-level mathematics. It follows standard mathematical conventions used in UK education.` },
  ],
  'fraction-calculator': [
    { question: `What does the Fraction Calculator do?`,  answer: `Add, subtract, multiply and divide fractions. Shows simplified result, mixed number and decimal.` },
    { question: `How accurate are the results?`,  answer: `This calculator uses standard mathematical algorithms and provides results accurate to the precision shown. For very large numbers or high-precision requirements, results are rounded to a reasonable number of decimal places.` },
    { question: `Can I use this for schoolwork?`,  answer: `Yes. This calculator is suitable for GCSE, A-level and university-level mathematics. It follows standard mathematical conventions used in UK education.` },
  ],
  'lawn-seed-calculator': [
    { question: `What does the Lawn Seed Calculator do?`,  answer: `Calculate grass seed needed for new lawns, overseeding or repair. Get bag counts and cost estimates.` },
    { question: `Does this include delivery costs?`,  answer: `This calculator estimates material quantities and approximate costs. Delivery charges vary by supplier, quantity and location. Bulk orders often qualify for free or reduced delivery.` },
    { question: `When is the best time for this project?`,  answer: `Timing depends on the specific project. Generally, spring and autumn are ideal for lawn and planting work, while hard landscaping can be done year-round in dry conditions.` },
  ],
  'topsoil-calculator': [
    { question: `What does the Topsoil Calculator — Tonnes & Cost do?`,  answer: `Calculate topsoil needed in cubic metres, tonnes or bags for garden beds and landscaping.` },
    { question: `Does this include delivery costs?`,  answer: `This calculator estimates material quantities and approximate costs. Delivery charges vary by supplier, quantity and location. Bulk orders often qualify for free or reduced delivery.` },
    { question: `When is the best time for this project?`,  answer: `Timing depends on the specific project. Generally, spring and autumn are ideal for lawn and planting work, while hard landscaping can be done year-round in dry conditions.` },
  ],
  'paving-calculator': [
    { question: `What does the Patio Paving Calculator do?`,  answer: `Calculate paving slabs needed for your patio or path. Includes jointing sand estimate.` },
    { question: `Does this include delivery costs?`,  answer: `This calculator estimates material quantities and approximate costs. Delivery charges vary by supplier, quantity and location. Bulk orders often qualify for free or reduced delivery.` },
    { question: `When is the best time for this project?`,  answer: `Timing depends on the specific project. Generally, spring and autumn are ideal for lawn and planting work, while hard landscaping can be done year-round in dry conditions.` },
  ],
  'ev-charging-calculator': [
    { question: `What does the EV Charging Cost Calculator do?`,  answer: `Calculate electric vehicle charging costs for home and public charging. Compare costs per mile.` },
    { question: `Does this use current UK rates?`,  answer: `Yes. This calculator uses the latest UK rates for vehicle tax, fuel duty and other motoring costs as of the 2026/27 financial year.` },
    { question: `Is this suitable for electric vehicles?`,  answer: `From April 2025, electric vehicles are no longer exempt from Vehicle Excise Duty (road tax). This calculator accounts for EV-specific rates where applicable.` },
  ],
  'commute-cost-calculator': [
    { question: `What does the Commute Cost Calculator do?`,  answer: `Calculate and compare annual commuting costs by car, train, bus or bicycle.` },
    { question: `Does this use current UK rates?`,  answer: `Yes. This calculator uses the latest UK rates for vehicle tax, fuel duty and other motoring costs as of the 2026/27 financial year.` },
    { question: `Is this suitable for electric vehicles?`,  answer: `From April 2025, electric vehicles are no longer exempt from Vehicle Excise Duty (road tax). This calculator accounts for EV-specific rates where applicable.` },
  ],
  'mileage-allowance-calculator': [
    { question: `What does the Mileage Allowance Calculator (HMRC) do?`,  answer: `Calculate HMRC approved mileage allowance payments for car, motorcycle or bicycle. 45p/25p per mile rates.` },
    { question: `Is this calculator based on 2026/27 rates?`,  answer: `Yes. This calculator uses the current 2026/27 UK tax year rates for income tax, National Insurance and other deductions, effective from 6 April 2026.` },
    { question: `Does this include pension contributions?`,  answer: `This calculator can factor in workplace pension contributions. Under auto-enrolment, the minimum is 8% total (5% employee + 3% employer) of qualifying earnings.` },
  ],
  'radiator-btu-calculator': [
    { question: `What does the Radiator BTU Calculator do?`,  answer: `Calculate the BTU and wattage needed for your radiators based on room size, glazing and insulation.` },
    { question: `Does this include waste allowance?`,  answer: `Yes. Most building material calculations include a standard 10% waste allowance. You can adjust this figure depending on the complexity of your project and cutting requirements.` },
    { question: `Are prices accurate?`,  answer: `Material prices are indicative estimates based on average UK prices. Actual costs vary by region, supplier, brand and current market conditions. Always get quotes from local suppliers.` },
  ],
  'bricks-calculator': [
    { question: `What does the Bricks & Blocks Calculator do?`,  answer: `Calculate bricks, sand and cement needed for walls. Accounts for openings and mortar joints.` },
    { question: `Does this include waste allowance?`,  answer: `Yes. Most building material calculations include a standard 10% waste allowance. You can adjust this figure depending on the complexity of your project and cutting requirements.` },
    { question: `Are prices accurate?`,  answer: `Material prices are indicative estimates based on average UK prices. Actual costs vary by region, supplier, brand and current market conditions. Always get quotes from local suppliers.` },
  ],
  'pace-calculator': [
    { question: `What does the Pace Calculator (Running) do?`,  answer: `Calculate running pace, finish time or distance. Supports km and mile splits for 5K, 10K, half marathon and marathon.` },
    { question: `How do I calculate pace?`,  answer: `Pace = time ÷ distance. A 30-minute 5K = 6:00/km (or 9:40/mile). UK runners typically use min/km for races and min/mile colloquially. To convert: 1km = 0.621 miles, so multiply min/km by 1.609 to get min/mile. Common race paces: 5K elite 2:50/km (sub-14min), good amateur 4:00/km (20min), beginner 6:00-7:00/km (30-35min). Marathon paces: elite 2:50/km (sub-2hr), good club 4:20/km (3hr), median UK finisher 5:40-6:00/km (4-4:15hr).` },
    { question: `What's a 'good' running pace for my age?`,  answer: `Average UK 5K times by age: 20-30 yo male 26-28 min, female 30-32 min; 40-50 yo male 28-31 min, female 33-35 min; 60+ yo male 33-36 min, female 38-42 min. parkrun's UK average is around 30 minutes. Personal improvement matters more than absolute pace — adding running 3 days/week typically improves 5K pace by 30-60 seconds over 3 months for beginners. Strava and parkrun let you benchmark against age/gender percentiles.` },
    { question: `Can pace predict race times?`,  answer: `Yes, with Jack Daniels' VDOT or McMillan running calculators: a 20-min 5K predicts 41-42min 10K, 1:32-1:34 half-marathon, 3:14-3:18 full marathon (assuming adequate endurance training). The longer the race, the more endurance training matters relative to pure pace. Many beginners run their 5K pace too hard, then can't sustain anything longer. Long slow distance (Z2) for 70-80% of weekly mileage is the foundation.` },

  ],
  'water-intake-calculator': [
    { question: `What does the Water Intake Calculator do?`,  answer: `Calculate your recommended daily water intake based on weight, activity level and climate.` },
    { question: `How much water should I drink?`,  answer: `NHS guideline: 6-8 glasses (1.2-1.5 litres) of fluid per day from drinks. EFSA recommends total fluid intake (drinks + food) of 2.0 litres for women, 2.5 litres for men. Food contributes ~20% — fruit, veg, soups, yoghurt. Increase for: hot weather (+500ml-1L), exercise (+500ml per hour), pregnancy (+300ml) or breastfeeding (+700ml), illness with fever/diarrhoea. The 'drink 8 glasses' rule has no scientific basis but isn't harmful.` },
    { question: `Can I drink too much water?`,  answer: `Yes — hyponatraemia (water intoxication) occurs when sodium levels drop dangerously low. Risk: drinking >1L/hour while sweating heavily (marathon runners, ravers). Symptoms: nausea, headache, confusion, seizures. Healthy kidneys can excrete ~0.8-1L/hour, so spread fluid intake. Sports drinks (containing sodium) help endurance athletes. Excess water on a normal day causes only frequent urination and is not harmful.` },
    { question: `Does tea, coffee, or beer count toward hydration?`,  answer: `Yes. The diuretic effect of caffeine is mild and offset by the water content. NHS counts tea, coffee, juice, and milk toward your fluid intake. Even beer is net hydrating per ml (1 pint of 4% beer adds ~95% of its volume in net fluids), though alcohol metabolism uses some water. Pure water remains the best choice — zero calories, no sugar, no caffeine. Sugar-free flavoured water or herbal tea works for those who dislike plain water.` },

  ],
  'overdraft-cost-calculator': [
    { question: `Why are UK overdrafts so expensive at ~40% EAR?`,  answer: `Since April 2020, the FCA has required all banks to charge a single representative APR for arranged overdrafts — banning daily fixed fees, monthly fees and tiered rates. Most major UK banks now charge 35-49.9% EAR (Lloyds 39.9%, Barclays 35%, Halifax 39.9%, HSBC 39.9%, Santander 39.9%, NatWest 39.49%). This makes arranged overdrafts more expensive than most credit cards (typically 20-25% APR), but cheaper than payday loans.` },
    { question: `What's the difference between arranged and unarranged overdrafts?`,  answer: `An arranged overdraft is a pre-agreed limit at the standard rate. An unarranged overdraft happens when you go below £0 without permission — since the 2020 FCA reforms, unarranged rates must not exceed the arranged rate (so banks can no longer charge £8 per unauthorised transaction etc.). However, transactions may still bounce, costing returned payment fees (typically £15-£25) and damaging your credit file.` },
    { question: `Will using my overdraft damage my credit score?`,  answer: `Regular use within the agreed limit usually does not directly damage your credit score, but consistently sitting at or near your limit can lower it because lenders see this as financial stress. Missed repayments (e.g. salary doesn't clear the overdraft for a billing cycle), defaults, or repeated unarranged overdraft usage all damage your score. Most lenders prefer to see overdraft usage at 0% or under 25% of the limit.` },
    { question: `Cheaper alternatives to a permanent overdraft?`,  answer: `A 0% money-transfer credit card moves cash into your current account at 0% interest for 18-24 months (typical fee 3-4%). A personal loan at 8-12% APR is cheaper than 40% overdraft EAR. A credit union loan (e.g. London Mutual, Hoot, Plane Saver) typically charges 12.7-26.8% APR. Switching banks to one with a £500-£1,000 free buffer (First Direct, Nationwide) can eliminate small overdraft costs entirely.` },
    { question: `Can I be forced to repay an overdraft?`,  answer: `Yes. Overdrafts are repayable on demand — banks can technically request the full balance at any time, though this is rare for accounts in good standing. More commonly, banks reduce or remove overdraft facilities if your income drops or credit score worsens. If you cannot repay, ask your bank to convert the balance to a fixed personal loan with structured monthly repayments. StepChange (0800 138 1111) and National Debtline (0808 808 4000) offer free help.` },
  ],
  'debt-free-calculator': [
    { question: `Avalanche vs Snowball — which debt payoff method is best?`,  answer: `The avalanche method targets the highest-interest debt first, mathematically saving the most money. The snowball method targets the smallest balance first, providing psychological wins. Research (Northwestern Kellogg, 2016) shows the snowball method has higher real-world success rates because motivation matters more than maths. If you have similar APRs across debts, snowball wins; if APRs vary widely (e.g. 8% personal loan + 39.9% overdraft + 25% credit card), avalanche saves significantly more.` },
    { question: `Should I prioritise paying off debt or saving an emergency fund?`,  answer: `Build a small starter emergency fund of £500-£1,000 first to avoid taking on new debt for unexpected costs (car breakdown, boiler repair). Then attack debt aggressively. Once high-interest debt (>10% APR) is cleared, build a full 3-6 month emergency fund. Don't try to save while paying 39% overdraft interest — you'll lose money every month. If you have an employer pension match, always claim that first (free money).` },
    { question: `Can making weekly/bi-weekly payments speed up payoff?`,  answer: `Yes, significantly. Splitting your monthly payment into two equal bi-weekly payments means you make 26 half-payments per year (= 13 monthly payments instead of 12). On a £15,000 loan at 8% APR over 5 years, this cuts the term by 5-6 months and saves £400+ in interest. Even more powerful for credit cards where interest compounds daily. Check your loan agreement first — some have minimum monthly payment requirements.` },
    { question: `What is the "Debt Snowflake" technique?`,  answer: `A snowflake is any small windfall (cashback, rebates, eBay sales, side hustle income, gift money) used to make an extra payment on debt. £5-£20 at a time. A £20 snowflake against a credit card balance compounds — that £20 saves not just the principal but all the interest that £20 would have generated. Apps like Plum, Chip and Snoop can auto-transfer small "round-up" amounts to your debt account. Combined with the snowball method, snowflakes can cut payoff timelines by 20-30%.` },
    { question: `When should I consider a Debt Management Plan or IVA?`,  answer: `A Debt Management Plan (DMP) is appropriate if you're missing minimum payments but have some surplus income — StepChange or PayPlan negotiate reduced payments with creditors, frozen interest, and a clear payoff date (usually 3-7 years). An Individual Voluntary Arrangement (IVA) is a legal alternative to bankruptcy: 5-6 years of fixed payments, remaining debt is written off, but stays on your credit file for 6 years. Don't pay private fee-charging firms — DMPs and IVAs are arranged for free through StepChange, National Debtline or Citizens Advice.` },
  ],
  'car-finance-calculator': [
    { question: `PCP vs HP vs personal loan — which is cheapest?`,  answer: `Personal loans typically have the lowest total cost because you own the car immediately and finance only the actual price. Hire Purchase (HP) is similar but the car is collateral. Personal Contract Purchase (PCP) has the lowest monthly payments because you finance the depreciation only, not the full car — but you don't own the car unless you pay a balloon payment (typically £8,000-£15,000) at the end. PCP wins if you want to change cars every 3 years; personal loan wins if you want to keep the car long-term.` },
    { question: `Can I walk away from PCP halfway through?`,  answer: `Yes — under the Consumer Credit Act 1974, you can use Voluntary Termination (VT) once you've paid 50% of the total amount payable (including interest and the balloon). The car goes back, you owe nothing further (subject to fair wear and tear and mileage). This is a powerful escape route if you can't afford payments. However, VT is reported to credit agencies (similar to a settled account, not a default).` },
    { question: `What's the "mis-sold car finance" scandal about?`,  answer: `Between 2007 and January 2021, many dealers earned higher commission by quoting customers higher interest rates ("discretionary commission arrangements" or DCA). The FCA banned DCAs in 2021. In October 2024, the Court of Appeal ruled in Johnson v FirstRand Bank that this was unlawful where commission wasn't disclosed. Compensation could exceed £30 billion industry-wide. Check with Lloyds Black Horse, Motonovo, Close Brothers and other lenders — affected agreements may be eligible for refunds plus 8% interest.` },
    { question: `What is GAP insurance and do I need it?`,  answer: `Guaranteed Asset Protection (GAP) insurance covers the gap between your car insurance payout and the outstanding finance balance if your car is written off or stolen. New cars depreciate 20-30% in the first year, so on PCP/HP your finance balance can easily exceed the car's market value. The FCA paused GAP sales in 2024 over fair value concerns — most policies were paying out only 6% of premiums. Now reformed, expect to pay £150-£300 for a 3-year policy. Worth it on new PCP deals; rarely worthwhile on used HP.` },
    { question: `Does a soft search affect my credit score?`,  answer: `No. A soft search is invisible to other lenders and doesn't affect your score. A hard search (full credit application) leaves a footprint for 12 months and reduces your score 5-10 points temporarily. Always use eligibility checkers (Experian, ClearScore, MoneySavingExpert Car Finance Eligibility) before applying for any car finance. Multiple hard searches within 14 days are often grouped as one by scoring algorithms (rate-shopping protection), but spread out hard searches damage your score more.` },
  ],
  'heat-pump-calculator': [
    { question: `What does the Heat Pump Running Cost Calculator do?`,  answer: `Compare heat pump vs gas/oil boiler running costs. Calculate payback period and annual savings.` },
    { question: `Does this reflect the current energy price cap?`,  answer: `This calculator uses representative energy prices. The Ofgem energy price cap changes quarterly — check Ofgem\'s website for the latest cap level applicable to your region and payment method.` },
    { question: `Can I save money by switching tariff?`,  answer: `Potentially yes. The energy market offers various fixed and variable tariffs. Use a comparison site authorised by Ofgem (such as Ofgem\'s own comparison tool) to check if switching could save you money.` },
  ],
  'savings-goal-calculator': [
    { question: `What does the Savings Goal Calculator do?`,  answer: `Calculate how long to reach your savings goal or how much to save monthly to hit a target date.` },
    { question: `Is this calculator suitable for financial decisions?`,  answer: `This calculator provides estimates for guidance only. Investment returns are not guaranteed and your capital is at risk. Consider seeking independent financial advice before making investment decisions.` },
    { question: `Are ISA contributions tax-free?`,  answer: `Yes. The annual ISA allowance for 2026/27 is £20,000. Any interest, dividends or capital gains within an ISA are completely tax-free.` },
  ],
  'number-to-words-calculator': [
    { question: `What does the Number to Words Converter do?`,  answer: `Convert any number to words in English. Includes cheque format for GBP amounts.` },
    { question: `Is this calculator free to use?`,  answer: `Yes. All calculators on Calks.uk are completely free to use. No account or registration is required. All calculations run in your browser — no data is collected.` },
    { question: `Can I use this on my phone?`,  answer: `Yes. All our calculators are fully responsive and work on smartphones, tablets and desktop computers. The interface adapts to your screen size automatically.` },
  ],
  'random-number-generator': [
    { question: `What does the Random Number Generator do?`,  answer: `Generate random numbers within a range. Supports multiple numbers with or without duplicates.` },
    { question: `Is this calculator free to use?`,  answer: `Yes. All calculators on Calks.uk are completely free to use. No account or registration is required. All calculations run in your browser — no data is collected.` },
    { question: `Can I use this on my phone?`,  answer: `Yes. All our calculators are fully responsive and work on smartphones, tablets and desktop computers. The interface adapts to your screen size automatically.` },
  ],
  'shoe-size-converter': [
    { question: `What does the Shoe Size Converter (UK/EU/US) do?`,  answer: `Convert shoe sizes between UK, EU, US (men and women) and centimetres.` },
    { question: `Is this calculator free to use?`,  answer: `Yes. All calculators on Calks.uk are completely free to use. No account or registration is required. All calculations run in your browser — no data is collected.` },
    { question: `Can I use this on my phone?`,  answer: `Yes. All our calculators are fully responsive and work on smartphones, tablets and desktop computers. The interface adapts to your screen size automatically.` },
  ],
  'ratio-calculator': [
    { question: `What does the Ratio Calculator — Simplify & Solve do?`,  answer: `Divide an amount by a given ratio. Simplify ratios and see percentage splits.` },
    { question: `Is this calculator free to use?`,  answer: `Yes. All calculators on Calks.uk are completely free to use. No account or registration is required. All calculations run in your browser — no data is collected.` },
    { question: `Can I use this on my phone?`,  answer: `Yes. All our calculators are fully responsive and work on smartphones, tablets and desktop computers. The interface adapts to your screen size automatically.` },
  ],
  'standard-deviation-calculator': [
    { question: `What does the Standard Deviation Calculator do?`,  answer: `Calculate standard deviation, variance, mean, median, min, max and range from a set of numbers.` },
    { question: `How accurate are the results?`,  answer: `This calculator uses standard mathematical algorithms and provides results accurate to the precision shown. For very large numbers or high-precision requirements, results are rounded to a reasonable number of decimal places.` },
    { question: `Can I use this for schoolwork?`,  answer: `Yes. This calculator is suitable for GCSE, A-level and university-level mathematics. It follows standard mathematical conventions used in UK education.` },
  ],
  'ucas-points-calculator': [
    { question: `What does the UCAS Tariff Points Calculator do?`,  answer: `Calculate your UCAS tariff points from A-Levels, AS-Levels, BTEC and EPQ qualifications.` },
    { question: `Is this based on current student finance rates?`,  answer: `Yes. This calculator uses Student Loans Company rates and thresholds for the 2026/27 academic and financial year. Thresholds and interest rates are updated annually.` },
    { question: `Which student loan plan am I on?`,  answer: `Plan 1 applies if you started before September 2012 (England/Wales) or are from Northern Ireland. Plan 2 applies from September 2012 in England/Wales. Plan 4 is for Scotland. Plan 5 applies from September 2023.` },
  ],
  'speed-fine-calculator': [
    { question: `What does the Speeding Fine Calculator do?`,  answer: `Estimate your speeding fine band, penalty points and potential driving ban based on UK sentencing guidelines.` },
    { question: `Does this use current UK rates?`,  answer: `Yes. This calculator uses the latest UK rates for vehicle tax, fuel duty and other motoring costs as of the 2026/27 financial year.` },
    { question: `Is this suitable for electric vehicles?`,  answer: `From April 2025, electric vehicles are no longer exempt from Vehicle Excise Duty (road tax). This calculator accounts for EV-specific rates where applicable.` },
  ],
  'binary-converter': [
    { question: `What does the Binary / Hex / Decimal Converter do?`,  answer: `Convert between binary, decimal, hexadecimal and octal number systems instantly.` },
    { question: `How accurate are the results?`,  answer: `This calculator uses standard mathematical algorithms and provides results accurate to the precision shown. For very large numbers or high-precision requirements, results are rounded to a reasonable number of decimal places.` },
    { question: `Can I use this for schoolwork?`,  answer: `Yes. This calculator is suitable for GCSE, A-level and university-level mathematics. It follows standard mathematical conventions used in UK education.` },
  ],
  'mulch-calculator': [
    { question: `What does the Mulch Calculator — Bags & Coverage do?`,  answer: `Calculate mulch needed in litres and bags for garden beds and borders.` },
    { question: `Does this include delivery costs?`,  answer: `This calculator estimates material quantities and approximate costs. Delivery charges vary by supplier, quantity and location. Bulk orders often qualify for free or reduced delivery.` },
    { question: `When is the best time for this project?`,  answer: `Timing depends on the specific project. Generally, spring and autumn are ideal for lawn and planting work, while hard landscaping can be done year-round in dry conditions.` },
  ],
  'ideal-weight-calculator': [
    { question: `What does the Ideal Weight Calculator do?`,  answer: `Calculate your ideal weight using Robinson, Miller, Devine and Hamwi formulas. See your healthy BMI range.` },
    { question: `Why are there different ideal weight formulas?`,  answer: `Common ones — Devine (1974): male 50kg + 2.3kg per inch over 5ft; female 45.5kg + 2.3kg per inch over 5ft. Robinson (1983): similar but adjusted. Miller (1983): male 56.2kg + 1.41kg per inch; female 53.1kg + 1.36kg per inch. Hamwi (1964): less accurate. BMI-based: weight × 22 (mid-range of healthy BMI 18.5-24.9). None is universally accurate — they were derived for medication dosing, not health goals. Use as a rough range, not a strict target.` },
    { question: `Is ideal weight even a useful concept?`,  answer: `Less so than people think. 'Healthy weight' is a range, not a single number. Two people of the same height and age can both be healthy at weights differing by 5-10kg if one is muscular and one is lean. Body composition (% muscle vs fat) matters more than total weight. Waist circumference (<94cm men, <80cm women) and waist-to-height ratio (<0.5) are better health indicators than BMI or 'ideal weight' formulas.` },
    { question: `What if I'm above 'ideal weight' but feel healthy?`,  answer: `If your blood pressure, cholesterol, blood sugar, and waist circumference are normal, you may be metabolically healthy at higher BMI — the 'overweight paradox'. However, even metabolically healthy higher weight increases joint pain, sleep apnoea, and certain cancers long-term. Focus on health markers, not the scale: can you climb stairs without breathing hard? Walk briskly for 30 min? Have energy through the day? These matter more than hitting a 'formula' weight.` },

  ],
  'fertiliser-calculator': [
    { question: `What does the Fertiliser Calculator do?`,  answer: `Calculate fertiliser needed for lawns, gardens and allotments based on area and application rate.` },
    { question: `Are these based on Defra rates?`,  answer: `Where applicable, this calculator uses rates and data from Defra, the Rural Payments Agency and industry standard references for UK agriculture.` },
    { question: `Does this account for regional variations?`,  answer: `UK farming conditions vary by region, soil type and climate. This calculator provides national average figures — adjust for your specific location and circumstances.` },
  ],
  'crop-yield-calculator': [
    { question: `What does the Crop Yield Calculator do?`,  answer: `Estimate crop yields for common vegetables and commercial crops. Calculate value of harvest.` },
    { question: `Are these based on Defra rates?`,  answer: `Where applicable, this calculator uses rates and data from Defra, the Rural Payments Agency and industry standard references for UK agriculture.` },
    { question: `Does this account for regional variations?`,  answer: `UK farming conditions vary by region, soil type and climate. This calculator provides national average figures — adjust for your specific location and circumstances.` },
  ],
  'break-even-calculator': [
    { question: `What does the Break-Even Calculator do?`,  answer: `Calculate the break-even point in units and revenue. Find your contribution margin.` },
    { question: `What's a 'good' break-even point?`,  answer: `Break-even shows where total revenue equals total costs — neither profit nor loss. Below break-even you lose money; above you profit. There's no universal 'good' figure — it depends on your industry, market size, and runway. A SaaS startup might need 18-24 months to reach break-even; a high-margin consulting business often does within 3-6 months. Lower break-even = lower risk, but requires either high prices or low fixed costs.` },
    { question: `What's the difference between cash break-even and accounting break-even?`,  answer: `Accounting break-even uses standard accrual revenue and costs (including non-cash items like depreciation). Cash break-even excludes non-cash items — focuses on what actually leaves your bank. A business can be 'profitable' on paper but cash-flow negative due to slow customer payments. Cash break-even is more important short-term; accounting break-even better reflects long-term economics.` },
    { question: `How do I lower my break-even point?`,  answer: `Three levers: (1) Raise prices — most powerful, but check market; even +5% revenue with same costs cuts break-even by ~5%; (2) Cut variable costs (better suppliers, materials, automation); (3) Cut fixed costs (renegotiate rent, reduce headcount, outsource non-core). Variable cost reductions scale with volume; fixed cost reductions help immediately. Start with the largest fixed cost line — often payroll or rent.` },

  ],
  'margin-calculator': [
    { question: `What does the Profit Margin & Markup Calculator do?`,  answer: `Calculate profit margin, markup percentage and selling price from cost and revenue.` },
    { question: `Margin vs Markup — what's the difference?`,  answer: `Margin = profit ÷ revenue (e.g. £20 profit on £100 sale = 20% margin). Markup = profit ÷ cost (e.g. £20 profit on £80 cost = 25% markup). A 50% margin equals 100% markup. A 25% margin equals 33% markup. Retailers usually quote in markup (because they know cost), customers think in margin (off the retail price). Confusing the two is one of the most common pricing mistakes.` },
    { question: `What's a healthy margin in my industry?`,  answer: `Typical UK net margins: Software/SaaS 15-30%, Professional services 10-20%, Retail 2-8%, Restaurants 3-6%, Construction 2-5%, Manufacturing 5-10%. Gross margins are higher (especially digital products: 70-90% gross is normal). If you're well above industry average — congrats; if well below — investigate pricing, costs, and competitive positioning. Use Companies House published accounts of competitors as benchmarks.` },
    { question: `Why is margin more important than revenue?`,  answer: `£1m revenue at 5% margin = £50k profit. £500k revenue at 20% margin = £100k profit. Doubling revenue is hard; improving margin by 5% is often achievable through better pricing, cost control, or product mix. Investors and acquirers value high-margin businesses more (often 3-5× revenue for SaaS at 70% margin vs 0.5-1× for services at 15% margin). Focus on margin growth before revenue scale.` },

  ],
  'depreciation-calculator': [
    { question: `What does the Depreciation Calculator do?`,  answer: `Calculate asset depreciation using straight-line or reducing balance methods with a year-by-year schedule.` },
    { question: `Straight-line vs Reducing Balance — which to use?`,  answer: `Straight-line (e.g. £10,000 ÷ 5 years = £2,000/year) is simpler and used for buildings, fittings, long-life assets. Reducing balance (apply % to remaining value each year) gives more depreciation in early years — used for vehicles, tech, equipment that loses value fast. UK GAAP and IFRS allow either, provided it reflects actual asset usage. For tax purposes, use HMRC's Capital Allowances (AIA, WDA) — separate from accounting depreciation.` },
    { question: `What's useful economic life for tax vs accounting?`,  answer: `Accounting depreciation must reflect 'useful economic life' — typically 3-5 years for IT, 5-10 years for vehicles, 25-50 years for buildings, indefinite for land. HMRC capital allowances ignore your accounting policy: writing down allowance is 18%/year (main pool) or 6% (special rate pool: buildings, integral features, cars over 50g/km CO2). The Annual Investment Allowance (AIA) gives 100% relief on qualifying plant up to £1m/year — usually wiping out depreciation expense for SMEs.` },
    { question: `Do I need to depreciate everything?`,  answer: `No. Below the de minimis threshold (~£100-£500 depending on policy), expense items immediately. Land doesn't depreciate. Goodwill is amortised under FRS 102 (UK GAAP) but not under IFRS (impairment-only). Software is depreciated over its useful life (typically 3-5 years). Repairs/maintenance are expensed; capital improvements are added to the asset and depreciated. Get your accountant's input — these classifications affect tax bills significantly.` },

  ],
  'visa-fee-calculator': [
    { question: `What does the UK Visa Fee Calculator do?`,  answer: `Calculate total UK visa costs including application fee, IHS surcharge, priority processing and dependants.` },
    { question: `Are visa fees up to date?`,  answer: `This calculator uses the current UK visa and immigration fees as published by UK Visas and Immigration (UKVI). Fees are reviewed periodically — check GOV.UK for the very latest amounts.` },
    { question: `Does this include the Immigration Health Surcharge?`,  answer: `Yes. The Immigration Health Surcharge (IHS) is included in the total cost calculation where applicable. The current IHS rate is £1,035 per year for most visa categories.` },
  ],
  'student-budget-calculator': [
    { question: `What does the Student Budget Calculator do?`,  answer: `Plan your university budget. Track income from loans, grants and jobs against monthly expenses.` },
    { question: `Is this based on current student finance rates?`,  answer: `Yes. This calculator uses Student Loans Company rates and thresholds for the 2026/27 academic and financial year. Thresholds and interest rates are updated annually.` },
    { question: `Which student loan plan am I on?`,  answer: `Plan 1 applies if you started before September 2012 (England/Wales) or are from Northern Ireland. Plan 2 applies from September 2012 in England/Wales. Plan 4 is for Scotland. Plan 5 applies from September 2023.` },
  ],
  'contractor-day-rate-calculator': [
    { question: `What does the Contractor Day Rate Calculator do?`,  answer: `Calculate the minimum day rate needed to achieve your target take-home pay. Inside and outside IR35.` },
    { question: `How do I convert a permanent salary to an equivalent day rate?`,  answer: `Rule of thumb: divide annual salary by 220-230 (working days minus holidays/sickness). A £60,000 salary equates to ~£275/day. But contractors have no paid holiday, sick pay, pension, training, or job security — so multiply that by 1.5-2.0 for true equivalence. Inside IR35, an £80,000 perm salary is roughly £450/day. Outside IR35, the same package needs only £350-£400/day because of dividend tax efficiency.` },
    { question: `What expenses can contractors claim through their limited company?`,  answer: `Wholly and exclusively for business: equipment (laptops, monitors, phones), software/SaaS, business insurance (PI/PL), accountancy fees (£800-£1,500/year), training, marketing, business travel (NOT commute), professional subscriptions, work-from-home flat rate £6/week. Inside IR35: most expenses lost. Outside IR35: claim via P11D or pay directly from company. Always have a paper trail for HMRC.` },
    { question: `Should I work via an umbrella company or my own Ltd?`,  answer: `Umbrella: simpler (no accounting), all-in employer NI + apprenticeship levy + holiday accrual + margin (~£25/week) baked in. Best for short engagements (<3 months) or first-time contractors. Ltd company: 5-10% more take-home outside IR35, plus pension flexibility (~£60k/year company contribution). Costs ~£100/month in accounting. Worth it from ~£40k/year contracting income upward.` },

  ],
  'electricity-cost-calculator': [
    { question: `What does the Electricity Cost Calculator (per appliance) do?`,  answer: `Calculate how much an appliance costs to run per day, week, month and year. Quick-select from common appliances.` },
    { question: `Does this reflect the current energy price cap?`,  answer: `This calculator uses representative energy prices. The Ofgem energy price cap changes quarterly — check Ofgem\'s website for the latest cap level applicable to your region and payment method.` },
    { question: `Can I save money by switching tariff?`,  answer: `Potentially yes. The energy market offers various fixed and variable tariffs. Use a comparison site authorised by Ofgem (such as Ofgem\'s own comparison tool) to check if switching could save you money.` },
  ],
  'led-savings-calculator': [
    { question: `What does the LED Bulb Savings Calculator do?`,  answer: `Calculate how much you save by switching from old bulbs to LED. See payback period and annual savings.` },
    { question: `Does this reflect the current energy price cap?`,  answer: `This calculator uses representative energy prices. The Ofgem energy price cap changes quarterly — check Ofgem\'s website for the latest cap level applicable to your region and payment method.` },
    { question: `Can I save money by switching tariff?`,  answer: `Potentially yes. The energy market offers various fixed and variable tariffs. Use a comparison site authorised by Ofgem (such as Ofgem\'s own comparison tool) to check if switching could save you money.` },
  ],
  'lbtt-ltt-calculator': [
    { question: `What does the LBTT (Scotland) / LTT (Wales) Calculator do?`,  answer: `Calculate Land & Buildings Transaction Tax (Scotland) or Land Transaction Tax (Wales) on property purchases.` },
    { question: `Is this calculator updated for the 2026/27 tax year?`,  answer: `Yes. This calculator uses the latest HMRC rates and thresholds for the 2026/27 UK tax year, which runs from 6 April 2026 to 5 April 2026. Rates are verified against official HMRC publications.` },
    { question: `Do I need to tell HMRC about this?`,  answer: `Whether you need to report to HMRC depends on your individual circumstances. If you are unsure, check GOV.UK or contact HMRC directly. This calculator provides estimates for guidance only.` },
  ],
  'sick-pay-calculator': [
    { question: `What does the Statutory Sick Pay Calculator do?`,  answer: `Calculate SSP entitlement at £123.25/week. Includes waiting days and maximum 28-week limit.` },
    { question: `Is this calculator based on 2026/27 rates?`,  answer: `Yes. This calculator uses the current 2026/27 UK tax year rates for income tax, National Insurance and other deductions, effective from 6 April 2026.` },
    { question: `Does this include pension contributions?`,  answer: `This calculator can factor in workplace pension contributions. Under auto-enrolment, the minimum is 8% total (5% employee + 3% employer) of qualifying earnings.` },
  ],
  'pay-rise-calculator': [
    { question: `What does the Pay Rise Calculator (Real Terms) do?`,  answer: `Check if your pay rise beats inflation. Compare nominal and real-terms increases.` },
    { question: `Is this calculator based on 2026/27 rates?`,  answer: `Yes. This calculator uses the current 2026/27 UK tax year rates for income tax, National Insurance and other deductions, effective from 6 April 2026.` },
    { question: `Does this include pension contributions?`,  answer: `This calculator can factor in workplace pension contributions. Under auto-enrolment, the minimum is 8% total (5% employee + 3% employer) of qualifying earnings.` },
  ],
  'annuity-calculator': [
    { question: `What does the Annuity Calculator — Retirement Income do?`,  answer: `Estimate annuity income from your pension pot. Compare single and joint life annuity rates by age.` },
    { question: `Are these figures guaranteed?`,  answer: `No. Pension projections are estimates based on assumed growth rates and current contribution levels. Actual returns depend on investment performance, fees and future policy changes.` },
    { question: `What is the pension annual allowance?`,  answer: `The pension annual allowance for 2026/27 is £60,000. This is the maximum you can contribute (including employer contributions) and receive tax relief. The allowance is tapered for high earners.` },
  ],
  'pension-vs-isa-calculator': [
    { question: `What does the Pension vs ISA Calculator do?`,  answer: `Compare pension and ISA over time. See which gives you more after tax relief and withdrawal tax.` },
    { question: `Are these figures guaranteed?`,  answer: `No. Pension projections are estimates based on assumed growth rates and current contribution levels. Actual returns depend on investment performance, fees and future policy changes.` },
    { question: `What is the pension annual allowance?`,  answer: `The pension annual allowance for 2026/27 is £60,000. This is the maximum you can contribute (including employer contributions) and receive tax relief. The allowance is tapered for high earners.` },
  ],
  'lifetime-isa-calculator': [
    { question: `What does the Lifetime ISA Calculator do?`,  answer: `Calculate LISA growth with the 25% government bonus. For first homes (up to £450K) or retirement (60+).` },
    { question: `Is this calculator suitable for financial decisions?`,  answer: `This calculator provides estimates for guidance only. Investment returns are not guaranteed and your capital is at risk. Consider seeking independent financial advice before making investment decisions.` },
    { question: `Are ISA contributions tax-free?`,  answer: `Yes. The annual ISA allowance for 2026/27 is £20,000. Any interest, dividends or capital gains within an ISA are completely tax-free.` },
  ],
  'child-maintenance-calculator': [
    { question: `What does the Child Maintenance (CMS) Calculator do?`,  answer: `Calculate child maintenance using CMS rules. Accounts for income, shared care nights and other children.` },
    { question: `Are benefit amounts accurate?`,  answer: `This calculator uses the published 2026/27 benefit rates. However, actual entitlements depend on a full assessment by the Department for Work and Pensions (DWP) and may differ from estimates.` },
    { question: `How do I claim this benefit?`,  answer: `You can apply for most benefits through GOV.UK or your local Jobcentre Plus. Some benefits require an online application; others may require a phone call or paper form.` },
  ],
  'moving-cost-calculator': [
    { question: `What does the Home Moving Cost Calculator do?`,  answer: `Calculate the total costs of buying a home — solicitor, stamp duty, survey, mortgage fees and removals.` },
    { question: `Is this based on current interest rates?`,  answer: `You can enter any interest rate to model different scenarios. Check the Bank of England base rate and current mortgage deals from lenders for the latest rates.` },
    { question: `Should I get professional advice?`,  answer: `This calculator provides estimates for guidance only. For a formal mortgage offer, speak to a mortgage broker or lender who can assess your full circumstances and provide personalised advice.` },
  ],
  'paternity-pay-calculator': [
    { question: `What does the Statutory Paternity Pay Calculator do?`,  answer: `Calculate SPP entitlement — 2 weeks at £194.32/week or 90% of AWE (whichever is lower).` },
    { question: `Is this calculator based on 2026/27 rates?`,  answer: `Yes. This calculator uses the current 2026/27 UK tax year rates for income tax, National Insurance and other deductions, effective from 6 April 2026.` },
    { question: `Does this include pension contributions?`,  answer: `This calculator can factor in workplace pension contributions. Under auto-enrolment, the minimum is 8% total (5% employee + 3% employer) of qualifying earnings.` },
  ],
  'notice-period-calculator': [
    { question: `What does the Notice Period Calculator do?`,  answer: `Calculate your statutory and contractual notice period based on years of service.` },
    { question: `Is this calculator based on 2026/27 rates?`,  answer: `Yes. This calculator uses the current 2026/27 UK tax year rates for income tax, National Insurance and other deductions, effective from 6 April 2026.` },
    { question: `Does this include pension contributions?`,  answer: `This calculator can factor in workplace pension contributions. Under auto-enrolment, the minimum is 8% total (5% employee + 3% employer) of qualifying earnings.` },
  ],
  'work-from-home-tax-relief-calculator': [
    { question: `What does the Working from Home Tax Relief Calculator do?`,  answer: `Calculate tax relief for working from home. £6/week flat rate or actual costs claim.` },
    { question: `Is this calculator based on 2026/27 rates?`,  answer: `Yes. This calculator uses the current 2026/27 UK tax year rates for income tax, National Insurance and other deductions, effective from 6 April 2026.` },
    { question: `Does this include pension contributions?`,  answer: `This calculator can factor in workplace pension contributions. Under auto-enrolment, the minimum is 8% total (5% employee + 3% employer) of qualifying earnings.` },
  ],
  'insulation-calculator': [
    { question: `What does the Insulation Calculator do?`,  answer: `Compare loft, cavity wall, solid wall and floor insulation costs, savings and payback periods.` },
    { question: `Does this include waste allowance?`,  answer: `Yes. Most building material calculations include a standard 10% waste allowance. You can adjust this figure depending on the complexity of your project and cutting requirements.` },
    { question: `Are prices accurate?`,  answer: `Material prices are indicative estimates based on average UK prices. Actual costs vary by region, supplier, brand and current market conditions. Always get quotes from local suppliers.` },
  ],
  'vat-return-calculator': [
    { question: `What does the VAT Return Calculator do?`,  answer: `Calculate your VAT return — output VAT on sales vs input VAT on purchases. See amount due or refund.` },
    { question: `What VAT scheme should my small business use?`,  answer: `Standard Accounting: works for most. Cash Accounting (turnover under £1.35m): pay VAT only when customers pay you. Annual Accounting: nine interim payments + final return. Flat Rate Scheme: pay flat % of gross turnover (varies 4-16.5% by industry) instead of input vs output VAT. Limited Cost Trader (16.5%) applies if goods cost less than 2% of turnover. Margin Scheme: for second-hand goods, art, antiques.` },
    { question: `When are VAT returns due and how often?`,  answer: `Standard VAT returns are quarterly via Making Tax Digital. Deadlines are 1 calendar month + 7 days after the quarter end (e.g. Q1 ending 31 March: due 7 May). Annual Accounting Scheme files one return per year. Pay electronically (Direct Debit gives 3 extra days). Late filing/payment incurs 1-15% surcharges and from January 2023 new 'points-based' penalties (one point per late return, £200 penalty at 4 points).` },
    { question: `What records do I need to keep for VAT?`,  answer: `MTD-compliant digital records of: VAT account, sales invoices (including VAT split), purchase invoices, credit notes, exempt supplies, partial exemption calculations, capital goods scheme records. Records must be kept for 6 years (10 years if using MOSS/OSS for cross-border digital sales). Digital records must transfer to HMRC via API — manual Excel uploads were banned April 2021.` },

  ],
  'payroll-calculator': [
    { question: `What does the Payroll Calculator — UK PAYE & NI do?`,  answer: `Run a monthly payroll calculation showing payslip breakdown, tax, NI, pension and employer costs.` },
    { question: `How often must UK employers run payroll?`,  answer: `Most UK employers pay monthly (~70%) or weekly (~25%). You must submit Full Payment Submission (FPS) to HMRC on or before each payday via Real Time Information (RTI). Late RTI: penalty £100-£400 per occurrence. PAYE/NI must be paid to HMRC by 22nd of month after pay period (19th by post). Small employers (<£1.5m PAYE/NI/year) can pay quarterly. Use commercial payroll software or HMRC's free Basic PAYE Tools.` },
    { question: `What's auto-enrolment and pension obligations?`,  answer: `Since 2018, all UK employers must auto-enrol eligible workers (aged 22 to State Pension age, earning over £10,000/year) into a workplace pension. Minimum contributions: 8% total on qualifying earnings (£6,240–£50,270 in 2026/27) — 3% employer + 5% employee. The Pensions Regulator can fine non-compliance up to £10,000/day. NEST is the government-backed default option; alternatives include People's Pension, Smart Pension, Aviva.` },
    { question: `What payroll records must I keep?`,  answer: `HMRC requires you to keep payroll records for 3 years after end of tax year, including: gross pay, deductions (tax, NI, student loan, AOE), employee details (NI number, address, DOB), payslips issued, P60s, P45s, P11Ds (benefits in kind), Real Time Information submissions. Pension scheme records: 6 years. Right to Work documents: 2 years after employment ends. Statutory pay records (SMP, SSP): 3 years.` },

  ],
  'late-payment-interest-calculator': [
    { question: `What does the Late Payment Interest Calculator do?`,  answer: `Calculate statutory interest and compensation on overdue commercial invoices under UK law.` },
    { question: `Is this suitable for my business?`,  answer: `This calculator provides general estimates based on standard UK business rates and rules. Every business is different — consult your accountant for advice specific to your circumstances.` },
    { question: `Does this use 2026/27 tax rates?`,  answer: `Yes. All rates and thresholds are based on the current 2026/27 UK tax year. Corporation Tax main rate is 25% for profits over £250,000, with a 19% small profits rate.` },
  ],
  'overtime-calculator': [
    { question: `What does the Overtime Pay Calculator do?`,  answer: `Calculate overtime earnings at time-and-a-half, double time or custom rates.` },
    { question: `Is this calculator based on 2026/27 rates?`,  answer: `Yes. This calculator uses the current 2026/27 UK tax year rates for income tax, National Insurance and other deductions, effective from 6 April 2026.` },
    { question: `Does this include pension contributions?`,  answer: `This calculator can factor in workplace pension contributions. Under auto-enrolment, the minimum is 8% total (5% employee + 3% employer) of qualifying earnings.` },
  ],
  'nhs-pay-calculator': [
    { question: `What does the NHS Pay Calculator (Agenda for Change) do?`,  answer: `Calculate NHS salary, take-home pay and hourly rate by Agenda for Change pay band.` },
    { question: `Is this calculator based on 2026/27 rates?`,  answer: `Yes. This calculator uses the current 2026/27 UK tax year rates for income tax, National Insurance and other deductions, effective from 6 April 2026.` },
    { question: `Does this include pension contributions?`,  answer: `This calculator can factor in workplace pension contributions. Under auto-enrolment, the minimum is 8% total (5% employee + 3% employer) of qualifying earnings.` },
  ],
  'childcare-cost-calculator': [
    { question: `What does the Childcare Costs Calculator (Tax-Free Childcare) do?`,  answer: `Calculate childcare costs with Tax-Free Childcare and 30 hours free entitlement.` },
    { question: `Are benefit amounts accurate?`,  answer: `This calculator uses the published 2026/27 benefit rates. However, actual entitlements depend on a full assessment by the Department for Work and Pensions (DWP) and may differ from estimates.` },
    { question: `How do I claim this benefit?`,  answer: `You can apply for most benefits through GOV.UK or your local Jobcentre Plus. Some benefits require an online application; others may require a phone call or paper form.` },
  ],
  'mot-date-calculator': [
    { question: `What does the MOT Date Calculator do?`,  answer: `Find when your next MOT is due. First MOT 3 years after registration, then annual.` },
    { question: `Does this use current UK rates?`,  answer: `Yes. This calculator uses the latest UK rates for vehicle tax, fuel duty and other motoring costs as of the 2026/27 financial year.` },
    { question: `Is this suitable for electric vehicles?`,  answer: `From April 2025, electric vehicles are no longer exempt from Vehicle Excise Duty (road tax). This calculator accounts for EV-specific rates where applicable.` },
  ],
  'train-season-ticket-calculator': [
    { question: `What does the Train Season Ticket Calculator do?`,  answer: `Compare daily, weekly, monthly and annual season ticket costs to find the best value.` },
    { question: `Does this use current UK rates?`,  answer: `Yes. This calculator uses the latest UK rates for vehicle tax, fuel duty and other motoring costs as of the 2026/27 financial year.` },
    { question: `Is this suitable for electric vehicles?`,  answer: `From April 2025, electric vehicles are no longer exempt from Vehicle Excise Duty (road tax). This calculator accounts for EV-specific rates where applicable.` },
  ],
  'driving-test-cost-calculator': [
    { question: `What does the Driving Test Cost Calculator do?`,  answer: `Calculate the total cost of learning to drive — lessons, theory test, practical test and provisional licence.` },
    { question: `Does this use current UK rates?`,  answer: `Yes. This calculator uses the latest UK rates for vehicle tax, fuel duty and other motoring costs as of the 2026/27 financial year.` },
    { question: `Is this suitable for electric vehicles?`,  answer: `From April 2025, electric vehicles are no longer exempt from Vehicle Excise Duty (road tax). This calculator accounts for EV-specific rates where applicable.` },
  ],
  'income-protection-calculator': [
    { question: `What does the Income Protection Calculator do?`,  answer: `Calculate income protection cover needed and estimate monthly premiums by age and deferral period.` },
    { question: `Are these actual quotes?`,  answer: `No. This calculator provides estimates based on typical UK insurance factors. Actual premiums depend on your specific circumstances. Always compare quotes from multiple insurers.` },
    { question: `Is insurance required by law?`,  answer: `Some insurance is legally required in the UK — such as motor insurance, employers\' liability insurance and buildings insurance (if you have a mortgage). Other types are optional but strongly recommended.` },
  ],
  'travel-insurance-calculator': [
    { question: `What does the Travel Insurance Calculator do?`,  answer: `Estimate travel insurance premiums for Europe and worldwide trips. Compare cover levels.` },
    { question: `Are these actual quotes?`,  answer: `No. This calculator provides estimates based on typical UK insurance factors. Actual premiums depend on your specific circumstances. Always compare quotes from multiple insurers.` },
    { question: `Is insurance required by law?`,  answer: `Some insurance is legally required in the UK — such as motor insurance, employers\' liability insurance and buildings insurance (if you have a mortgage). Other types are optional but strongly recommended.` },
  ],
  'spousal-maintenance-calculator': [
    { question: `What does the Spousal Maintenance Calculator do?`,  answer: `Estimate spousal maintenance range for divorce. Based on income difference and length of marriage.` },
    { question: `Are court fees accurate?`,  answer: `This calculator uses the current UK court fee schedule. Fees are set by the Ministry of Justice and are reviewed periodically. Check GOV.UK for the very latest fee amounts.` },
    { question: `Do I need a solicitor?`,  answer: `Whether you need a solicitor depends on the complexity of your case. For straightforward matters you may be able to represent yourself, but for significant legal issues professional advice is recommended.` },
  ],
  'gcse-grade-calculator': [
    { question: `What does the GCSE Grade Calculator (9-1) do?`,  answer: `Calculate Attainment 8 score, average grade and pass counts from your GCSE grades.` },
    { question: `Is this based on current student finance rates?`,  answer: `Yes. This calculator uses Student Loans Company rates and thresholds for the 2026/27 academic and financial year. Thresholds and interest rates are updated annually.` },
    { question: `Which student loan plan am I on?`,  answer: `Plan 1 applies if you started before September 2012 (England/Wales) or are from Northern Ireland. Plan 2 applies from September 2012 in England/Wales. Plan 4 is for Scotland. Plan 5 applies from September 2023.` },
  ],
  'university-cost-calculator': [
    { question: `What does the University Cost Calculator do?`,  answer: `Calculate the total cost of university including tuition fees, maintenance loan and living costs.` },
    { question: `Is this based on current student finance rates?`,  answer: `Yes. This calculator uses Student Loans Company rates and thresholds for the 2026/27 academic and financial year. Thresholds and interest rates are updated annually.` },
    { question: `Which student loan plan am I on?`,  answer: `Plan 1 applies if you started before September 2012 (England/Wales) or are from Northern Ireland. Plan 2 applies from September 2012 in England/Wales. Plan 4 is for Scotland. Plan 5 applies from September 2023.` },
  ],
  'greenhouse-size-calculator': [
    { question: `What does the Greenhouse Size Calculator do?`,  answer: `Calculate greenhouse growing capacity. See how many plants fit by type with common size presets.` },
    { question: `Does this include delivery costs?`,  answer: `This calculator estimates material quantities and approximate costs. Delivery charges vary by supplier, quantity and location. Bulk orders often qualify for free or reduced delivery.` },
    { question: `When is the best time for this project?`,  answer: `Timing depends on the specific project. Generally, spring and autumn are ideal for lawn and planting work, while hard landscaping can be done year-round in dry conditions.` },
  ],
  'pond-volume-calculator': [
    { question: `What does the Pond Volume Calculator do?`,  answer: `Calculate pond volume in litres, pump size and liner dimensions for rectangle, circle or oval ponds.` },
    { question: `Does this include delivery costs?`,  answer: `This calculator estimates material quantities and approximate costs. Delivery charges vary by supplier, quantity and location. Bulk orders often qualify for free or reduced delivery.` },
    { question: `When is the best time for this project?`,  answer: `Timing depends on the specific project. Generally, spring and autumn are ideal for lawn and planting work, while hard landscaping can be done year-round in dry conditions.` },
  ],
  'side-hustle-tax-calculator': [
    { question: `What does the Side Hustle / Trading Allowance Calculator do?`,  answer: `Calculate tax on side hustle income. Use the £1,000 trading allowance or claim actual expenses.` },
    { question: `Is this calculator updated for the 2026/27 tax year?`,  answer: `Yes. This calculator uses the latest HMRC rates and thresholds for the 2026/27 UK tax year, which runs from 6 April 2026 to 5 April 2026. Rates are verified against official HMRC publications.` },
    { question: `Do I need to tell HMRC about this?`,  answer: `Whether you need to report to HMRC depends on your individual circumstances. If you are unsure, check GOV.UK or contact HMRC directly. This calculator provides estimates for guidance only.` },
  ],
  'employment-tribunal-calculator': [
    { question: `What does the Employment Tribunal Award Calculator do?`,  answer: `Estimate unfair dismissal tribunal awards — basic award and compensatory award.` },
    { question: `Are court fees accurate?`,  answer: `This calculator uses the current UK court fee schedule. Fees are set by the Ministry of Justice and are reviewed periodically. Check GOV.UK for the very latest fee amounts.` },
    { question: `Do I need a solicitor?`,  answer: `Whether you need a solicitor depends on the complexity of your case. For straightforward matters you may be able to represent yourself, but for significant legal issues professional advice is recommended.` },
  ],
  'roof-tiles-calculator': [
    { question: `What does the Roof Tiles Calculator do?`,  answer: `Calculate roof tiles, ridge tiles, batten and felt needed based on roof dimensions and pitch.` },
    { question: `Does this include waste allowance?`,  answer: `Yes. Most building material calculations include a standard 10% waste allowance. You can adjust this figure depending on the complexity of your project and cutting requirements.` },
    { question: `Are prices accurate?`,  answer: `Material prices are indicative estimates based on average UK prices. Actual costs vary by region, supplier, brand and current market conditions. Always get quotes from local suppliers.` },
  ],
  'water-bill-calculator': [
    { question: `What does the Water Bill Calculator do?`,  answer: `Estimate your annual water bill for metered or unmetered supply including sewerage charges.` },
    { question: `Does this reflect the current energy price cap?`,  answer: `This calculator uses representative energy prices. The Ofgem energy price cap changes quarterly — check Ofgem\'s website for the latest cap level applicable to your region and payment method.` },
    { question: `Can I save money by switching tariff?`,  answer: `Potentially yes. The energy market offers various fixed and variable tariffs. Use a comparison site authorised by Ofgem (such as Ofgem\'s own comparison tool) to check if switching could save you money.` },
  ],
  'buy-to-let-yield-calculator': [
    { question: `What does the Buy-to-Let Yield Calculator do?`,  answer: `Calculate gross yield, net yield, return on deposit and monthly cashflow for buy-to-let investments.` },
    { question: `Is this based on current interest rates?`,  answer: `You can enter any interest rate to model different scenarios. Check the Bank of England base rate and current mortgage deals from lenders for the latest rates.` },
    { question: `Should I get professional advice?`,  answer: `This calculator provides estimates for guidance only. For a formal mortgage offer, speak to a mortgage broker or lender who can assess your full circumstances and provide personalised advice.` },
  ],
  'ltv-calculator': [
    { question: `What does the Loan-to-Value (LTV) Calculator do?`,  answer: `Calculate your LTV ratio and see how it affects mortgage rates and borrowing options.` },
    { question: `Is this based on current interest rates?`,  answer: `You can enter any interest rate to model different scenarios. Check the Bank of England base rate and current mortgage deals from lenders for the latest rates.` },
    { question: `Should I get professional advice?`,  answer: `This calculator provides estimates for guidance only. For a formal mortgage offer, speak to a mortgage broker or lender who can assess your full circumstances and provide personalised advice.` },
  ],
  'stamp-duty-additional-property-calculator': [
    { question: `What does the Stamp Duty Additional Property Calculator do?`,  answer: `Calculate SDLT with the 5% additional property surcharge for buy-to-let and second homes.` },
    { question: `Is this calculator updated for the 2026/27 tax year?`,  answer: `Yes. This calculator uses the latest HMRC rates and thresholds for the 2026/27 UK tax year, which runs from 6 April 2026 to 5 April 2026. Rates are verified against official HMRC publications.` },
    { question: `Do I need to tell HMRC about this?`,  answer: `Whether you need to report to HMRC depends on your individual circumstances. If you are unsure, check GOV.UK or contact HMRC directly. This calculator provides estimates for guidance only.` },
  ],
  'remortgage-calculator': [
    { question: `What does the Remortgage Calculator do?`,  answer: `Compare current vs new mortgage rate. See monthly savings, break-even and total cost including fees.` },
    { question: `When should I start looking to remortgage?`,  answer: `3-6 months before your current fixed deal ends. Mortgage offers are usually valid 3-6 months, letting you lock in today's rate even though your current deal hasn't ended. If rates rise during this period, you keep the lower offered rate. If rates fall, you can usually switch to a better offer before completion. Don't leave it later than 3 months — moving to the lender's SVR (typically 7-9%) for even 1 month can cost £500+.` },
    { question: `Product transfer vs full remortgage — which?`,  answer: `Product transfer (staying with same lender, picking a new rate) is faster (1-2 weeks, no full application), no legal/valuation costs, no credit search. Full remortgage to a new lender requires application, valuation, conveyancing (£500-£1,500) — but often gets a 0.1-0.5% better rate. Calculator: 0.3% saving on £200k mortgage = £600/year = often pays back the £1,000 switching cost in <2 years. Switch lenders if rate gain >0.3% over your fix period.` },
    { question: `Can I remortgage with bad credit or recent changes?`,  answer: `Possible but harder. Lenders re-assess affordability and credit each remortgage. Recent issues (missed payments, defaults, IVAs) reduce your options. CCJs older than 3 years usually OK with high-street lenders. Most lenders won't remortgage during a probation period or first 6 months of self-employment. If declined, options include: stay on SVR temporarily (expensive), use a specialist sub-prime lender (worse rates), 'product transfer' with your existing lender (less rigorous).` },

  ],
  'debt-to-income-calculator': [
    { question: `What does the Debt-to-Income Ratio Calculator do?`,  answer: `Calculate your DTI ratio to see if lenders will approve your mortgage or loan application.` },
    { question: `Is this based on current interest rates?`,  answer: `You can enter any interest rate to model different scenarios. Check the Bank of England base rate and current mortgage deals from lenders for the latest rates.` },
    { question: `Should I get professional advice?`,  answer: `This calculator provides estimates for guidance only. For a formal mortgage offer, speak to a mortgage broker or lender who can assess your full circumstances and provide personalised advice.` },
  ],
  'apr-calculator': [
    { question: `What does the APR Calculator — True Interest Rate do?`,  answer: `Calculate the true Annual Percentage Rate of any loan from the amount borrowed and total repaid.` },
    { question: `APR vs APRC vs AER vs EAR — what's the difference?`,  answer: `APR (Annual Percentage Rate): true cost of borrowing on most consumer credit — includes interest + mandatory fees. APRC (Annual Percentage Rate of Charge): mortgages — includes interest, set-up fees, valuation costs over the deal life. AER (Annual Equivalent Rate): savings — what you actually earn including compounding. EAR (Effective Annual Rate): credit cards — what you'd pay if you carried a balance for a year. UK law requires APR/APRC on all consumer credit advertising for honest comparison.` },
    { question: `Representative APR vs personal APR.`,  answer: `FCA CONC 3.5 — lenders must offer the advertised 'representative APR' to at least 51% of accepted applicants. The other 49% can be offered a higher 'personal APR' based on credit score, income, debt-to-income, loan amount. A '6.9% representative APR' loan might cost you 9-12% APR. Always do a soft search via Experian Eligibility, ClearScore, MSE Loans Eligibility before applying — soft searches don't damage your credit score and show your likely personal rate.` },
    { question: `Why is the APR higher than the interest rate?`,  answer: `APR includes the interest rate PLUS any mandatory fees (arrangement, broker, admin) spread over the loan term. A £10,000 loan at 6% interest with a £300 arrangement fee over 5 years = ~7.4% APR. The longer the loan term, the smaller the fee impact on APR (a £300 fee over 5 years = 60p/year vs £300 over 1 year = full £300). Always compare loans by APR, not headline interest rate, to see true cost.` },

  ],
  'bnpl-calculator': [
    { question: `What does the Buy Now Pay Later Calculator do?`,  answer: `Calculate BNPL instalment costs for Klarna, Clearpay and custom plans. See the true cost and late fee risks.` },
    { question: `Does this use current UK interest rates?`,  answer: `You can enter any interest rate to model different scenarios. The Bank of England base rate and FCA guidelines influence typical lending rates available in the UK market.` },
    { question: `Should I get professional debt advice?`,  answer: `If you are struggling with debt, free professional advice is available from StepChange (0800 138 1111), Citizens Advice, and the National Debtline (0808 808 4000). This calculator provides estimates only.` },
  ],
  'salary-sacrifice-pension-calculator': [
    { question: `What does the Salary Sacrifice Pension Calculator do?`,  answer: `Compare salary sacrifice vs relief at source pension contributions. See tax and NI savings.` },
    { question: `Are these figures guaranteed?`,  answer: `No. Pension projections are estimates based on assumed growth rates and current contribution levels. Actual returns depend on investment performance, fees and future policy changes.` },
    { question: `What is the pension annual allowance?`,  answer: `The pension annual allowance for 2026/27 is £60,000. This is the maximum you can contribute (including employer contributions) and receive tax relief. The allowance is tapered for high earners.` },
  ],
  'temperature-converter': [
    { question: `What does the Temperature Converter do?`,  answer: `Convert between Celsius, Fahrenheit and Kelvin instantly. Includes common temperature reference points and conversion formulas.` },
    { question: `Is this calculator free to use?`,  answer: `Yes. All calculators on Calks.uk are completely free to use. No account or registration is required. All calculations run in your browser — no data is collected.` },
    { question: `Can I use this on my phone?`,  answer: `Yes. All our calculators are fully responsive and work on smartphones, tablets and desktop computers. The interface adapts to your screen size automatically.` },
  ],
  'length-converter': [
    { question: `What does the Length Converter — Metric & Imperial do?`,  answer: `Convert between mm, cm, metres, km, inches, feet, yards and miles. Includes feet & inches display.` },
    { question: `Is this calculator free to use?`,  answer: `Yes. All calculators on Calks.uk are completely free to use. No account or registration is required. All calculations run in your browser — no data is collected.` },
    { question: `Can I use this on my phone?`,  answer: `Yes. All our calculators are fully responsive and work on smartphones, tablets and desktop computers. The interface adapts to your screen size automatically.` },
  ],
  'area-converter': [
    { question: `What does the Area Converter (m² / ft² / acres) do?`,  answer: `Convert between square metres, square feet, acres, hectares and more. Includes all common UK area units with instant results.` },
    { question: `Is this calculator free to use?`,  answer: `Yes. All calculators on Calks.uk are completely free to use. No account or registration is required. All calculations run in your browser — no data is collected.` },
    { question: `Can I use this on my phone?`,  answer: `Yes. All our calculators are fully responsive and work on smartphones, tablets and desktop computers. The interface adapts to your screen size automatically.` },
  ],
  'cooking-converter': [
    { question: `What does the Cooking Measurement Converter do?`,  answer: `Convert between ml, cups, tablespoons, pints and ounces. Includes gas mark to °C/°F chart.` },
    { question: `Is this calculator free to use?`,  answer: `Yes. All calculators on Calks.uk are completely free to use. No account or registration is required. All calculations run in your browser — no data is collected.` },
    { question: `Can I use this on my phone?`,  answer: `Yes. All our calculators are fully responsive and work on smartphones, tablets and desktop computers. The interface adapts to your screen size automatically.` },
  ],
  'timezone-converter': [
    { question: `What does the Time Zone Converter do?`,  answer: `Convert times between 15+ world time zones. See all zones at a glance.` },
    { question: `Is this calculator free to use?`,  answer: `Yes. All calculators on Calks.uk are completely free to use. No account or registration is required. All calculations run in your browser — no data is collected.` },
    { question: `Can I use this on my phone?`,  answer: `Yes. All our calculators are fully responsive and work on smartphones, tablets and desktop computers. The interface adapts to your screen size automatically.` },
  ],
  'ilr-calculator': [
    { question: `What does the ILR Eligibility Calculator do?`,  answer: `Check if you qualify for Indefinite Leave to Remain based on your visa route, time in UK and absences.` },
    { question: `Are visa fees up to date?`,  answer: `This calculator uses the current UK visa and immigration fees as published by UK Visas and Immigration (UKVI). Fees are reviewed periodically — check GOV.UK for the very latest amounts.` },
    { question: `Does this include the Immigration Health Surcharge?`,  answer: `Yes. The Immigration Health Surcharge (IHS) is included in the total cost calculation where applicable. The current IHS rate is £1,035 per year for most visa categories.` },
  ],
  'steps-to-miles-calculator': [
    { question: `What does the Steps to Miles/Km Calculator do?`,  answer: `Convert steps to distance, calories and walking time based on your height and stride length.` },
    { question: `What's the conversion?`,  answer: `Average step length is 0.762m (2.5ft) for men and 0.660m (2.2ft) for women. Steps per mile: ~2,100 for men, ~2,440 for women. Steps per km: ~1,300 (men), ~1,520 (women). Your actual step length depends on height: roughly height × 0.415 (cm). A 1.75m (5'9') person has ~73cm steps = 2,200 steps/mile. Stride length (left-to-left) is 2× step length.` },
    { question: `Is 10,000 steps a day really necessary?`,  answer: `10,000 came from a 1965 Japanese marketing campaign — not science. Recent research: 7,000-8,000 steps/day correlates with significant mortality reduction; benefits plateau around 10,000-12,000. For older adults (>60): 6,000-8,000 steps gives most health benefit. More important than total: 30+ minutes of moderate activity (e.g. brisk walking ~100 steps/min) per day. NHS recommends 150 min/week of moderate activity, achievable in ~21,000 steps over a week.` },
    { question: `Walking vs running for fitness?`,  answer: `For cardiovascular health, both work — running just packs the same benefit into less time. Walking is gentler on joints (impact ~1.3× body weight vs 2.5× for running). Brisk walking (5-6km/h) raises heart rate enough for aerobic benefit; leisurely walking (3-4km/h) is good for general activity but not cardiovascular fitness. Best practice: combine — 3-4 brisk walks + 1-2 runs per week, or 'walking interval' workouts (alternate 3 min brisk + 1 min recovery).` },

  ],
  'heart-rate-zone-calculator': [
    { question: `What does the Heart Rate Zone Calculator do?`,  answer: `Calculate your 5 heart rate training zones using the Karvonen formula with resting heart rate.` },
    { question: `How are heart rate zones calculated?`,  answer: `Most common: % of Maximum Heart Rate (MHR). Tanaka's formula MHR = 208 − (0.7 × age) is more accurate than the old 220−age. Zones: Z1 50-60% MHR (warmup/recovery), Z2 60-70% (fat burning, aerobic base), Z3 70-80% (aerobic threshold), Z4 80-90% (anaerobic threshold, lactate), Z5 90-100% (VO2 max, maximal). For more precision: Heart Rate Reserve (HRR) method uses (MHR − Resting HR) × target % + Resting HR.` },
    { question: `What's the 'fat burning zone' and is it the best for weight loss?`,  answer: `Z2 (60-70% MHR) burns the highest % of calories from fat. But total calorie burn is lower than Z3-Z4. For weight loss, total calories burned matter most, not the percentage from fat. A 30-min Z2 walk burns ~150 cal (70% fat); a 30-min Z4 HIIT burns ~350 cal (40% fat) — the HIIT burns more fat in absolute terms. Mixing Z2 (most workouts, builds endurance) with 1-2 Z4 sessions/week is optimal.` },
    { question: `Should I wear a heart rate monitor?`,  answer: `Useful for serious training (marathon prep, cycling, triathlon). Chest straps (Polar H10, Garmin HRM-Pro) are most accurate — typically within 1-2 bpm of medical-grade ECG. Optical wrist sensors (Apple Watch, Garmin, Fitbit) are good for steady-state but lag/miss during HIIT or weight training. For general fitness, RPE (rate of perceived exertion: 1-10) is sufficient and trains 'feel' for pace.` },

  ],
  'probability-calculator': [
    { question: `What does the Probability Calculator do?`,  answer: `Calculate event probabilities, combinations and permutations. P(A or B), P(A and B), nCr, nPr.` },
    { question: `How accurate are the results?`,  answer: `This calculator uses standard mathematical algorithms and provides results accurate to the precision shown. For very large numbers or high-precision requirements, results are rounded to a reasonable number of decimal places.` },
    { question: `Can I use this for schoolwork?`,  answer: `Yes. This calculator is suitable for GCSE, A-level and university-level mathematics. It follows standard mathematical conventions used in UK education.` },
  ],
  'annual-tax-summary-calculator': [
    { question: `What does the Annual Tax Summary Calculator do?`,  answer: `Calculate your total tax bill from all income sources — salary, dividends, self-employment, rental and capital gains.` },
    { question: `Is this calculator updated for the 2026/27 tax year?`,  answer: `Yes. This calculator uses the latest HMRC rates and thresholds for the 2026/27 UK tax year, which runs from 6 April 2026 to 5 April 2026. Rates are verified against official HMRC publications.` },
    { question: `Do I need to tell HMRC about this?`,  answer: `Whether you need to report to HMRC depends on your individual circumstances. If you are unsure, check GOV.UK or contact HMRC directly. This calculator provides estimates for guidance only.` },
  ],
  'business-rates-calculator': [
    { question: `What does the Business Rates Calculator do?`,  answer: `Calculate business rates from rateable value. Includes Small Business Rate Relief.` },
    { question: `What is rateable value and how is it set?`,  answer: `Rateable Value (RV) is the Valuation Office Agency's estimate of the annual rent your property would let for on a specific date (1 April 2021 for the current 2023 rating list). It's based on size, location, condition, and comparison to similar properties. RV is NOT your actual rent — many businesses pay more or less than RV. Revaluations happen every ~3 years (next in 2026).` },
    { question: `Can I appeal my business rates?`,  answer: `Yes, via the VOA's three-stage Check Challenge Appeal process. Check: confirm property facts on GOV.UK Business Rates Find a Property. Challenge: submit evidence within 4 months that the valuation is wrong (rental evidence from similar properties, errors in description). Appeal: escalate to the Valuation Tribunal if rejected. About 30% of Challenges succeed. You can backdate refunds up to 6 years.` },
    { question: `Do I pay business rates if I work from home?`,  answer: `Usually no, if you only use a small part of your home for occasional work and customers don't visit. But if you have dedicated employees, customers visiting regularly, structural alterations for business use, or use a significant portion exclusively for business, the VOA may treat part of your home as a separately rated business property. Self-employed and home offices remain personal in the vast majority of cases.` },

  ],
  'rd-tax-credit-calculator': [
    { question: `What does the R&D Tax Credit Calculator do?`,  answer: `Estimate R&D tax credits for profitable and loss-making companies under the merged RDEC scheme.` },
    { question: `Who qualifies for R&D tax credits?`,  answer: `UK limited companies undertaking projects that seek 'an advance in science or technology' through resolution of 'scientific or technological uncertainty'. Must be more than routine work — genuine technical risk and innovation. Eligible sectors range from software (algorithms, machine learning, novel architectures), biotech, manufacturing process improvements, materials science, to AgTech and renewables. Self-employed individuals and partnerships cannot claim — must be a company.` },
    { question: `Two schemes — RDEC vs Small Profits Rate?`,  answer: `Since April 2024, the schemes merged into a single 'merged R&D scheme' with 20% above-the-line credit (RDEC-style). For loss-making SMEs (with R&D intensity >30% of expenditure), there's an enhanced rate (~26-27% effective). Pre-April 2024 claims could be under SME scheme (130% enhancement + payable credit) or large company RDEC. PAYE/NI cap on payable credits: £20k + 3× total PAYE/NI in the claim period.` },
    { question: `What costs qualify?`,  answer: `Staff costs (salaries, NI, pension contributions of staff engaged in R&D), subcontractor costs (limited), externally provided workers, consumables (software licences directly used, materials, lighting/heat for R&D space), data and cloud computing costs (since April 2023). Capital expenditure does NOT qualify (use Capital Allowances instead). Indirect activities (training, project management for R&D, finance support) may qualify. Documentation is critical — HMRC enquiry rates have risen sharply.` },

  ],
  'cis-calculator': [
    { question: `What does the CIS Subcontractor Tax Calculator do?`,  answer: `Calculate CIS deductions on subcontractor invoices at 20%, 30% or gross payment status.` },
    { question: `Who needs to register for CIS?`,  answer: `Construction Industry Scheme applies to construction work in the UK. Contractors (those who pay subcontractors for construction work) MUST register if they spend over £3m on construction in 12 months. Subcontractors should register to avoid 30% emergency deduction (registered = 20% deduction, gross payment status = 0% deduction). Mainstream contractors include developers, property investors, homeowners doing extensive work over £3m, and businesses with a majority of construction spend.` },
    { question: `What is gross payment status and how do I get it?`,  answer: `Gross payment status means contractors pay you without CIS deduction — you settle tax annually via Self Assessment/Corporation Tax. To qualify: (1) UK construction work for income, (2) annual turnover at least £30k (sole trader) / £30k per director (Ltd) / £100k+ total (partnership), (3) clean compliance history (filed and paid taxes on time). Apply via gov.uk/cis-gross-payment-status. HMRC review status annually.` },
    { question: `What counts as a CIS deduction-able payment?`,  answer: `Deductible: labour costs only on construction work (carpentry, plastering, painting, civils, electrical, plumbing on construction sites). Not deductible: materials (must be itemised separately), VAT, hire/plant rental, professional fees (architects, surveyors), travel/lodging unless part of contract. Always issue payment and deduction statements (PDS) to subcontractors monthly. Contractors file monthly CIS returns to HMRC.` },

  ],
  'pet-insurance-calculator': [
    { question: `What does the Pet Insurance Calculator do?`,  answer: `Estimate pet insurance premiums for dogs and cats by age, breed and cover level.` },
    { question: `Are these actual quotes?`,  answer: `No. This calculator provides estimates based on typical UK insurance factors. Actual premiums depend on your specific circumstances. Always compare quotes from multiple insurers.` },
    { question: `Is insurance required by law?`,  answer: `Some insurance is legally required in the UK — such as motor insurance, employers\' liability insurance and buildings insurance (if you have a mortgage). Other types are optional but strongly recommended.` },
  ],
  'student-maintenance-loan-calculator': [
    { question: `What does the Student Maintenance Loan Calculator do?`,  answer: `Estimate your maintenance loan based on household income and living situation. England 2026/27 rates.` },
    { question: `Is this based on current student finance rates?`,  answer: `Yes. This calculator uses Student Loans Company rates and thresholds for the 2026/27 academic and financial year. Thresholds and interest rates are updated annually.` },
    { question: `Which student loan plan am I on?`,  answer: `Plan 1 applies if you started before September 2012 (England/Wales) or are from Northern Ireland. Plan 2 applies from September 2012 in England/Wales. Plan 4 is for Scotland. Plan 5 applies from September 2023.` },
  ],
  'boiler-replacement-calculator': [
    { question: `What does the Boiler Replacement Cost Calculator do?`,  answer: `Compare old vs new boiler efficiency. Calculate installation cost, annual savings and payback period.` },
    { question: `Does this reflect the current energy price cap?`,  answer: `This calculator uses representative energy prices. The Ofgem energy price cap changes quarterly — check Ofgem\'s website for the latest cap level applicable to your region and payment method.` },
    { question: `Can I save money by switching tariff?`,  answer: `Potentially yes. The energy market offers various fixed and variable tariffs. Use a comparison site authorised by Ofgem (such as Ofgem\'s own comparison tool) to check if switching could save you money.` },
  ],
  'double-glazing-calculator': [
    { question: `What does the Double Glazing Savings Calculator do?`,  answer: `Calculate double glazing costs and annual energy savings by house type. See payback period.` },
    { question: `Does this reflect the current energy price cap?`,  answer: `This calculator uses representative energy prices. The Ofgem energy price cap changes quarterly — check Ofgem\'s website for the latest cap level applicable to your region and payment method.` },
    { question: `Can I save money by switching tariff?`,  answer: `Potentially yes. The energy market offers various fixed and variable tariffs. Use a comparison site authorised by Ofgem (such as Ofgem\'s own comparison tool) to check if switching could save you money.` },
  ],
  'weight-loss-calculator': [
    { question: `What does the Weight Loss Calculator do?`,  answer: `Calculate how long to reach your target weight with milestones and daily calorie deficit.` },
    { question: `Is this medical advice?`,  answer: `No. This calculator is for informational purposes only and does not constitute medical advice. Always consult your GP or an appropriate healthcare professional for medical guidance.` },
    { question: `Are the reference values from the NHS?`,  answer: `Where applicable, this calculator uses reference values and guidelines from the NHS and other UK health authorities. Individual needs may vary based on personal health circumstances.` },
  ],
  'protein-intake-calculator': [
    { question: `What does the Protein Intake Calculator do?`,  answer: `Calculate daily protein needs by weight and goal. See common protein sources per serving.` },
    { question: `How much protein do I really need?`,  answer: `RDA minimum is 0.8g/kg body weight (set to prevent deficiency in sedentary adults). For active people and those wanting to preserve/build muscle: 1.6-2.2g/kg. For weight loss in caloric deficit: 2.0-2.4g/kg (higher protein preserves muscle when dieting). Elderly (over 65): 1.2-1.5g/kg to combat sarcopenia. Excessive protein (>3.5g/kg) shows no extra muscle benefit and may stress kidneys in those with pre-existing kidney disease.` },
    { question: `Are plant proteins as good as animal proteins?`,  answer: `Per gram, yes — if you combine varied sources. Animal proteins (eggs, dairy, meat, fish) are 'complete' — contain all 9 essential amino acids in good ratios. Plant proteins are usually limiting in one or two amino acids: grains (low lysine), legumes (low methionine). Combining grains + legumes (rice + beans, lentil curry + roti) gives a complete profile. Top plant sources: soya (tofu, tempeh), seitan, lentils, chickpeas, hemp seeds, quinoa, peanuts. Aim for 25-30g per meal.` },
    { question: `Does timing protein matter?`,  answer: `Less than people think. Total daily intake matters most. The 'anabolic window' (30 min post-workout) is largely a myth for normal trainees — protein synthesis stays elevated 24-48 hours after resistance training. However, spreading protein across 3-5 meals of 25-40g each maximises muscle protein synthesis better than 1-2 large meals. Pre-bed protein (casein, Greek yoghurt) helps overnight muscle recovery for serious lifters.` },

  ],
  'ovulation-calculator': [
    { question: `What does the Ovulation Calculator do?`,  answer: `Estimate ovulation date and fertile window based on your last period and cycle length. See 3 cycles ahead.` },
    { question: `Is this medical advice?`,  answer: `No. This calculator is for informational purposes only and does not constitute medical advice. Always consult your GP or an appropriate healthcare professional for medical guidance.` },
    { question: `Are the reference values from the NHS?`,  answer: `Where applicable, this calculator uses reference values and guidelines from the NHS and other UK health authorities. Individual needs may vary based on personal health circumstances.` },
  ],
  'car-lease-vs-buy-calculator': [
    { question: `What does the Car Lease vs Buy Calculator do?`,  answer: `Compare leasing vs buying a car on finance. See which is cheaper after depreciation and interest.` },
    { question: `Does this use current UK rates?`,  answer: `Yes. This calculator uses the latest UK rates for vehicle tax, fuel duty and other motoring costs as of the 2026/27 financial year.` },
    { question: `Is this suitable for electric vehicles?`,  answer: `From April 2025, electric vehicles are no longer exempt from Vehicle Excise Duty (road tax). This calculator accounts for EV-specific rates where applicable.` },
  ],
  'sole-trader-vs-ltd-calculator': [
    { question: `What does the Sole Trader vs Limited Company Calculator do?`,  answer: `Compare take-home pay as a sole trader vs limited company director. See full tax breakdown for both.` },
    { question: `Is this suitable for my business?`,  answer: `This calculator provides general estimates based on standard UK business rates and rules. Every business is different — consult your accountant for advice specific to your circumstances.` },
    { question: `Does this use 2026/27 tax rates?`,  answer: `Yes. All rates and thresholds are based on the current 2026/27 UK tax year. Corporation Tax main rate is 25% for profits over £250,000, with a 19% small profits rate.` },
  ],
  'pension-credit-calculator': [
    { question: `What does the Pension Credit Calculator do?`,  answer: `Estimate Pension Credit Guarantee Credit entitlement based on income, pension and savings.` },
    { question: `Are benefit amounts accurate?`,  answer: `This calculator uses the published 2026/27 benefit rates. However, actual entitlements depend on a full assessment by the Department for Work and Pensions (DWP) and may differ from estimates.` },
    { question: `How do I claim this benefit?`,  answer: `You can apply for most benefits through GOV.UK or your local Jobcentre Plus. Some benefits require an online application; others may require a phone call or paper form.` },
  ],
  'housing-benefit-calculator': [
    { question: `What does the Housing Benefit Calculator do?`,  answer: `Estimate Housing Benefit based on rent, LHA rate and income. Includes taper calculation.` },
    { question: `Are benefit amounts accurate?`,  answer: `This calculator uses the published 2026/27 benefit rates. However, actual entitlements depend on a full assessment by the Department for Work and Pensions (DWP) and may differ from estimates.` },
    { question: `How do I claim this benefit?`,  answer: `You can apply for most benefits through GOV.UK or your local Jobcentre Plus. Some benefits require an online application; others may require a phone call or paper form.` },
  ],
  'vat-threshold-calculator': [
    { question: `What does the VAT Threshold Monitor do?`,  answer: `Track your rolling 12-month turnover against the £90,000 VAT registration threshold. See headroom remaining.` },
    { question: `What's the VAT threshold in 2026/27?`,  answer: `£90,000 of taxable turnover in any rolling 12-month period (not financial year). The £90,000 threshold has applied since 1 April 2024 (up from £85,000). You must register within 30 days of exceeding it, with effect from the start of the month after you cross. You can also voluntarily register at any turnover level. Once registered, you must charge VAT on standard-rated supplies and submit VAT returns (typically quarterly via Making Tax Digital).` },
    { question: `Should I voluntarily register for VAT below £90,000?`,  answer: `Yes if: most customers are VAT-registered businesses (they reclaim VAT, so it's neutral for them); you pay significant input VAT on supplies, equipment, or services; you sell zero-rated goods (children's clothes, books, most food) — you reclaim input VAT but customers pay 0% output. No if: customers are mostly consumers or non-VAT businesses (adding 20% makes you uncompetitive); your supplies are exempt (financial, healthcare, education); your admin capacity is limited.` },
    { question: `What happens when I cross the threshold?`,  answer: `You have 30 days from end of the month you crossed to notify HMRC. VAT registration becomes effective from the first day of the month after you notify. Register online via gov.uk/register-for-vat. You'll receive a VAT number within ~10 days. Then charge VAT on all standard-rated invoices from your effective date, and submit MTD-compliant quarterly returns. Watch for inadvertent crossing — many businesses with seasonal peaks accidentally cross then can't reverse retroactively.` },

  ],
  'umbrella-company-calculator': [
    { question: `What does the Umbrella Company Calculator do?`,  answer: `Calculate take-home pay through an umbrella company. See full payslip breakdown with employer NI and fees.` },
    { question: `Is this calculator based on 2026/27 rates?`,  answer: `Yes. This calculator uses the current 2026/27 UK tax year rates for income tax, National Insurance and other deductions, effective from 6 April 2026.` },
    { question: `Does this include pension contributions?`,  answer: `This calculator can factor in workplace pension contributions. Under auto-enrolment, the minimum is 8% total (5% employee + 3% employer) of qualifying earnings.` },
  ],
  'plaster-calculator': [
    { question: `What does the Plaster Calculator — Bags & Coverage do?`,  answer: `Calculate plaster needed in 25kg bags for skim coat, bonding/browning or one-coat plaster.` },
    { question: `Does this include waste allowance?`,  answer: `Yes. Most building material calculations include a standard 10% waste allowance. You can adjust this figure depending on the complexity of your project and cutting requirements.` },
    { question: `Are prices accurate?`,  answer: `Material prices are indicative estimates based on average UK prices. Actual costs vary by region, supplier, brand and current market conditions. Always get quotes from local suppliers.` },
  ],
  'staircase-calculator': [
    { question: `What does the Staircase Calculator do?`,  answer: `Calculate risers, treads, pitch and going for a staircase. Checks Building Regulations Part K compliance.` },
    { question: `Does this include waste allowance?`,  answer: `Yes. Most building material calculations include a standard 10% waste allowance. You can adjust this figure depending on the complexity of your project and cutting requirements.` },
    { question: `Are prices accurate?`,  answer: `Material prices are indicative estimates based on average UK prices. Actual costs vary by region, supplier, brand and current market conditions. Always get quotes from local suppliers.` },
  ],
  'exam-score-calculator': [
    { question: `What does the Exam Score Calculator do?`,  answer: `Calculate exam percentage and grade. Find out what score you need on remaining papers to hit your target.` },
    { question: `Is this based on current student finance rates?`,  answer: `Yes. This calculator uses Student Loans Company rates and thresholds for the 2026/27 academic and financial year. Thresholds and interest rates are updated annually.` },
    { question: `Which student loan plan am I on?`,  answer: `Plan 1 applies if you started before September 2012 (England/Wales) or are from Northern Ireland. Plan 2 applies from September 2012 in England/Wales. Plan 4 is for Scotland. Plan 5 applies from September 2023.` },
  ],
  'roman-numeral-converter': [
    { question: `What does the Roman Numeral Converter do?`,  answer: `Convert between decimal numbers and Roman numerals (I, V, X, L, C, D, M). Both directions.` },
    { question: `How accurate are the results?`,  answer: `This calculator uses standard mathematical algorithms and provides results accurate to the precision shown. For very large numbers or high-precision requirements, results are rounded to a reasonable number of decimal places.` },
    { question: `Can I use this for schoolwork?`,  answer: `Yes. This calculator is suitable for GCSE, A-level and university-level mathematics. It follows standard mathematical conventions used in UK education.` },
  ],
  'capital-allowances-calculator': [
    { question: `What does the Capital Allowances Calculator do?`,  answer: `Calculate AIA, Full Expensing or Writing Down Allowance on business assets. See year-by-year tax relief.` },
    { question: `Is this suitable for my business?`,  answer: `This calculator provides general estimates based on standard UK business rates and rules. Every business is different — consult your accountant for advice specific to your circumstances.` },
    { question: `Does this use 2026/27 tax rates?`,  answer: `Yes. All rates and thresholds are based on the current 2026/27 UK tax year. Corporation Tax main rate is 25% for profits over £250,000, with a 19% small profits rate.` },
  ],
  'cash-flow-calculator': [
    { question: `What does the Cash Flow Calculator do?`,  answer: `Project monthly cash flow with income and expenses. See closing balance and lowest point.` },
    { question: `Is this suitable for my business?`,  answer: `This calculator provides general estimates based on standard UK business rates and rules. Every business is different — consult your accountant for advice specific to your circumstances.` },
    { question: `Does this use 2026/27 tax rates?`,  answer: `Yes. All rates and thresholds are based on the current 2026/27 UK tax year. Corporation Tax main rate is 25% for profits over £250,000, with a 19% small profits rate.` },
  ],
  'spouse-visa-calculator': [
    { question: `What does the UK Spouse Visa Income Calculator do?`,  answer: `Check if you meet the £29,000 minimum income for a UK Spouse visa. Includes savings calculation and total visa costs.` },
    { question: `Are visa fees up to date?`,  answer: `This calculator uses the current UK visa and immigration fees as published by UK Visas and Immigration (UKVI). Fees are reviewed periodically — check GOV.UK for the very latest amounts.` },
    { question: `Does this include the Immigration Health Surcharge?`,  answer: `Yes. The Immigration Health Surcharge (IHS) is included in the total cost calculation where applicable. The current IHS rate is £1,035 per year for most visa categories.` },
  ],
  'farm-operating-cost-calculator': [
    { question: `What does the Farm Operating Cost Calculator do?`,  answer: `Calculate per-hectare costs and profitability for arable farming. See break-even price per tonne.` },
    { question: `Are these based on Defra rates?`,  answer: `Where applicable, this calculator uses rates and data from Defra, the Rural Payments Agency and industry standard references for UK agriculture.` },
    { question: `Does this account for regional variations?`,  answer: `UK farming conditions vary by region, soil type and climate. This calculator provides national average figures — adjust for your specific location and circumstances.` },
  ],
  'personal-injury-calculator': [
    { question: `What does the Personal Injury Compensation Calculator do?`,  answer: `Estimate personal injury compensation based on Judicial College Guidelines for common injury types.` },
    { question: `Are court fees accurate?`,  answer: `This calculator uses the current UK court fee schedule. Fees are set by the Ministry of Justice and are reviewed periodically. Check GOV.UK for the very latest fee amounts.` },
    { question: `Do I need a solicitor?`,  answer: `Whether you need a solicitor depends on the complexity of your case. For straightforward matters you may be able to represent yourself, but for significant legal issues professional advice is recommended.` },
  ],
  'investment-return-calculator': [
    { question: `What does the Investment Return Calculator do?`,  answer: `Calculate nominal and real (inflation-adjusted) investment returns with monthly contributions over time.` },
    { question: `Is this calculator suitable for financial decisions?`,  answer: `This calculator provides estimates for guidance only. Investment returns are not guaranteed and your capital is at risk. Consider seeking independent financial advice before making investment decisions.` },
    { question: `Are ISA contributions tax-free?`,  answer: `Yes. The annual ISA allowance for 2026/27 is £20,000. Any interest, dividends or capital gains within an ISA are completely tax-free.` },
  ],
  'savings-interest-tax-calculator': [
    { question: `What does the Savings Interest Tax Calculator do?`,  answer: `Calculate tax on savings interest above your Personal Savings Allowance. See max tax-free savings.` },
    { question: `Is this calculator suitable for financial decisions?`,  answer: `This calculator provides estimates for guidance only. Investment returns are not guaranteed and your capital is at risk. Consider seeking independent financial advice before making investment decisions.` },
    { question: `Are ISA contributions tax-free?`,  answer: `Yes. The annual ISA allowance for 2026/27 is £20,000. Any interest, dividends or capital gains within an ISA are completely tax-free.` },
  ],
  'real-return-calculator': [
    { question: `What does the Real Return Calculator (After Inflation) do?`,  answer: `Calculate the real return on investments after accounting for inflation. See purchasing power impact.` },
    { question: `Is this calculator suitable for financial decisions?`,  answer: `This calculator provides estimates for guidance only. Investment returns are not guaranteed and your capital is at risk. Consider seeking independent financial advice before making investment decisions.` },
    { question: `Are ISA contributions tax-free?`,  answer: `Yes. The annual ISA allowance for 2026/27 is £20,000. Any interest, dividends or capital gains within an ISA are completely tax-free.` },
  ],
  'rule-of-72-calculator': [
    { question: `What does the Rule of 72 Calculator do?`,  answer: `Estimate how long it takes to double your money at a given interest rate using the Rule of 72.` },
    { question: `Is this calculator suitable for financial decisions?`,  answer: `This calculator provides estimates for guidance only. Investment returns are not guaranteed and your capital is at risk. Consider seeking independent financial advice before making investment decisions.` },
    { question: `Are ISA contributions tax-free?`,  answer: `Yes. The annual ISA allowance for 2026/27 is £20,000. Any interest, dividends or capital gains within an ISA are completely tax-free.` },
  ],
  'cost-of-delay-calculator': [
    { question: `What does the Cost of Delay Calculator do?`,  answer: `See how much you lose by waiting to invest. Compare starting now vs delaying by 1-10+ years.` },
    { question: `Is this calculator suitable for financial decisions?`,  answer: `This calculator provides estimates for guidance only. Investment returns are not guaranteed and your capital is at risk. Consider seeking independent financial advice before making investment decisions.` },
    { question: `Are ISA contributions tax-free?`,  answer: `Yes. The annual ISA allowance for 2026/27 is £20,000. Any interest, dividends or capital gains within an ISA are completely tax-free.` },
  ],
  'teacher-pay-calculator': [
    { question: `What does the Teacher Pay Calculator do?`,  answer: `Calculate teacher salary by pay scale (M1-M6, UPS, Leadership). Includes London weighting and take-home pay.` },
    { question: `Is this calculator based on 2026/27 rates?`,  answer: `Yes. This calculator uses the current 2026/27 UK tax year rates for income tax, National Insurance and other deductions, effective from 6 April 2026.` },
    { question: `Does this include pension contributions?`,  answer: `This calculator can factor in workplace pension contributions. Under auto-enrolment, the minimum is 8% total (5% employee + 3% employer) of qualifying earnings.` },
  ],
  'shared-parental-leave-calculator': [
    { question: `What does the Shared Parental Leave Calculator do?`,  answer: `Split parental leave between parents. Calculate ShPP payments for mother and partner.` },
    { question: `Is this calculator based on 2026/27 rates?`,  answer: `Yes. This calculator uses the current 2026/27 UK tax year rates for income tax, National Insurance and other deductions, effective from 6 April 2026.` },
    { question: `Does this include pension contributions?`,  answer: `This calculator can factor in workplace pension contributions. Under auto-enrolment, the minimum is 8% total (5% employee + 3% employer) of qualifying earnings.` },
  ],
  'high-income-child-benefit-calculator': [
    { question: `What does the High Income Child Benefit Charge Calculator do?`,  answer: `Calculate HICBC clawback between £60K-£80K. See if you should still claim for NI credits.` },
    { question: `Are benefit amounts accurate?`,  answer: `This calculator uses the published 2026/27 benefit rates. However, actual entitlements depend on a full assessment by the Department for Work and Pensions (DWP) and may differ from estimates.` },
    { question: `How do I claim this benefit?`,  answer: `You can apply for most benefits through GOV.UK or your local Jobcentre Plus. Some benefits require an online application; others may require a phone call or paper form.` },
  ],
  'benefit-cap-calculator': [
    { question: `What does the Benefit Cap Calculator do?`,  answer: `Check if the benefit cap applies and how much your benefits will be reduced.` },
    { question: `Are benefit amounts accurate?`,  answer: `This calculator uses the published 2026/27 benefit rates. However, actual entitlements depend on a full assessment by the Department for Work and Pensions (DWP) and may differ from estimates.` },
    { question: `How do I claim this benefit?`,  answer: `You can apply for most benefits through GOV.UK or your local Jobcentre Plus. Some benefits require an online application; others may require a phone call or paper form.` },
  ],
  'trigonometry-calculator': [
    { question: `What does the Trigonometry Calculator do?`,  answer: `Calculate sin, cos, tan and inverse functions in degrees or radians. Includes sec, csc, cot.` },
    { question: `How accurate are the results?`,  answer: `This calculator uses standard mathematical algorithms and provides results accurate to the precision shown. For very large numbers or high-precision requirements, results are rounded to a reasonable number of decimal places.` },
    { question: `Can I use this for schoolwork?`,  answer: `Yes. This calculator is suitable for GCSE, A-level and university-level mathematics. It follows standard mathematical conventions used in UK education.` },
  ],
  'freelance-tax-calculator': [
    { question: `What does the Freelance Tax Calculator do?`,  answer: `Calculate freelancer take-home pay from day rate. Includes tax, NI, expenses and VAT threshold warning.` },
    { question: `Is this calculator based on 2026/27 rates?`,  answer: `Yes. This calculator uses the current 2026/27 UK tax year rates for income tax, National Insurance and other deductions, effective from 6 April 2026.` },
    { question: `Does this include pension contributions?`,  answer: `This calculator can factor in workplace pension contributions. Under auto-enrolment, the minimum is 8% total (5% employee + 3% employer) of qualifying earnings.` },
  ],
  'macro-calculator': [
    { question: `What does the Macro Calculator — Protein, Carbs & Fat do?`,  answer: `Calculate daily protein, carbs and fat targets based on your body stats, activity and goal.` },
    { question: `What macros should I eat for my goal?`,  answer: `General starting splits: weight loss 40C/30P/30F (g for carbs/protein/fat); maintenance 50C/20P/30F; muscle gain 40C/30P/30F with caloric surplus; ketogenic 5C/25P/70F. Protein scales with body weight: 1.6-2.2g per kg for active people; 0.8g/kg sedentary minimum. Fat minimum 0.5g/kg for hormone health. Carbs fill the remaining calories. Athletes (>1hr training daily) need 4-7g carbs/kg/day.` },
    { question: `How do I count macros without weighing everything?`,  answer: `Apps like MyFitnessPal, Cronometer, and Lose It! have UK food databases. Tools that simplify: hand portion method (palm = protein, fist = veg, thumb = fat, cupped hand = carbs); pre-prepped meals with known macros (Joe & The Juice, Pret, M&S clearly label); meal-prep services (Fresh Fitness Food, MuscleFood). For sustainability, aim for 80% accuracy — chasing precision often leads to disordered eating patterns.` },
    { question: `Do I need to hit exact macros every day?`,  answer: `No. Weekly averages matter more than daily. A few days slightly off doesn't derail progress; consistent 80%+ adherence over weeks does. Protein is the most important to hit daily (insufficient intake compromises muscle retention during deficit). Carbs and fat can flex around training and social events. The macro split that works long-term is the one you can sustain — not the one optimal on paper but impossible to follow.` },

  ],
  'cost-of-living-calculator': [
    { question: `What does the Cost of Living Calculator do?`,  answer: `Track monthly expenses against take-home pay. See surplus or shortfall with editable UK average costs.` },
    { question: `Is this calculator free to use?`,  answer: `Yes. All calculators on Calks.uk are completely free to use. No account or registration is required. All calculations run in your browser — no data is collected.` },
    { question: `Can I use this on my phone?`,  answer: `Yes. All our calculators are fully responsive and work on smartphones, tablets and desktop computers. The interface adapts to your screen size automatically.` },
  ],
  'smart-meter-calculator': [
    { question: `What does the Smart Meter / Appliance Cost Calculator do?`,  answer: `Calculate daily electricity cost from individual appliances. Adjust usage hours for each device.` },
    { question: `Does this reflect the current energy price cap?`,  answer: `This calculator uses representative energy prices. The Ofgem energy price cap changes quarterly — check Ofgem\'s website for the latest cap level applicable to your region and payment method.` },
    { question: `Can I save money by switching tariff?`,  answer: `Potentially yes. The energy market offers various fixed and variable tariffs. Use a comparison site authorised by Ofgem (such as Ofgem\'s own comparison tool) to check if switching could save you money.` },
  ],
  'gpa-calculator': [
    { question: `What does the GPA Calculator (UK) do?`,  answer: `Calculate UK GPA from module grades and credits. See degree classification equivalent.` },
    { question: `Is this based on current student finance rates?`,  answer: `Yes. This calculator uses Student Loans Company rates and thresholds for the 2026/27 academic and financial year. Thresholds and interest rates are updated annually.` },
    { question: `Which student loan plan am I on?`,  answer: `Plan 1 applies if you started before September 2012 (England/Wales) or are from Northern Ireland. Plan 2 applies from September 2012 in England/Wales. Plan 4 is for Scotland. Plan 5 applies from September 2023.` },
  ],
  'solicitor-fee-calculator': [
    { question: `What does the Solicitor Fee Estimate Calculator do?`,  answer: `Estimate solicitor fees for conveyancing, divorce, wills, probate and employment matters.` },
    { question: `Are court fees accurate?`,  answer: `This calculator uses the current UK court fee schedule. Fees are set by the Ministry of Justice and are reviewed periodically. Check GOV.UK for the very latest fee amounts.` },
    { question: `Do I need a solicitor?`,  answer: `Whether you need a solicitor depends on the complexity of your case. For straightforward matters you may be able to represent yourself, but for significant legal issues professional advice is recommended.` },
  ],
  'divorce-settlement-calculator': [
    { question: `What does the Divorce Financial Settlement Calculator do?`,  answer: `Estimate how assets might be split in a divorce — property, pensions, savings and debts.` },
    { question: `Are court fees accurate?`,  answer: `This calculator uses the current UK court fee schedule. Fees are set by the Ministry of Justice and are reviewed periodically. Check GOV.UK for the very latest fee amounts.` },
    { question: `Do I need a solicitor?`,  answer: `Whether you need a solicitor depends on the complexity of your case. For straightforward matters you may be able to represent yourself, but for significant legal issues professional advice is recommended.` },
  ],
  'uk-citizenship-calculator': [
    { question: `What does the UK Citizenship Eligibility Calculator do?`,  answer: `Check citizenship eligibility after ILR. See timeline, absence limits and total application costs.` },
    { question: `Are visa fees up to date?`,  answer: `This calculator uses the current UK visa and immigration fees as published by UK Visas and Immigration (UKVI). Fees are reviewed periodically — check GOV.UK for the very latest amounts.` },
    { question: `Does this include the Immigration Health Surcharge?`,  answer: `Yes. The Immigration Health Surcharge (IHS) is included in the total cost calculation where applicable. The current IHS rate is £1,035 per year for most visa categories.` },
  ],
  'free-school-meals-calculator': [
    { question: `What does the Free School Meals Eligibility Calculator do?`,  answer: `Check if your children qualify for free school meals. See annual savings and qualifying benefits.` },
    { question: `Are benefit amounts accurate?`,  answer: `This calculator uses the published 2026/27 benefit rates. However, actual entitlements depend on a full assessment by the Department for Work and Pensions (DWP) and may differ from estimates.` },
    { question: `How do I claim this benefit?`,  answer: `You can apply for most benefits through GOV.UK or your local Jobcentre Plus. Some benefits require an online application; others may require a phone call or paper form.` },
  ],
  'loft-conversion-calculator': [
    { question: `What does the Loft Conversion Cost Calculator do?`,  answer: `Estimate loft conversion costs by type (Velux, dormer, hip-to-gable, mansard). See ROI and value added.` },
    { question: `Does this include waste allowance?`,  answer: `Yes. Most building material calculations include a standard 10% waste allowance. You can adjust this figure depending on the complexity of your project and cutting requirements.` },
    { question: `Are prices accurate?`,  answer: `Material prices are indicative estimates based on average UK prices. Actual costs vary by region, supplier, brand and current market conditions. Always get quotes from local suppliers.` },
  ],
  'extension-cost-calculator': [
    { question: `What does the Extension Cost Calculator do?`,  answer: `Estimate home extension costs per m² for single/double storey, side return and wrap-around extensions.` },
    { question: `Does this include waste allowance?`,  answer: `Yes. Most building material calculations include a standard 10% waste allowance. You can adjust this figure depending on the complexity of your project and cutting requirements.` },
    { question: `Are prices accurate?`,  answer: `Material prices are indicative estimates based on average UK prices. Actual costs vary by region, supplier, brand and current market conditions. Always get quotes from local suppliers.` },
  ],
  'childcare-entitlement-calculator': [
    { question: `What does the 30 Hours Free Childcare Calculator do?`,  answer: `Check free childcare entitlement by age (15/30 hours). See savings with Tax-Free Childcare.` },
    { question: `Are benefit amounts accurate?`,  answer: `This calculator uses the published 2026/27 benefit rates. However, actual entitlements depend on a full assessment by the Department for Work and Pensions (DWP) and may differ from estimates.` },
    { question: `How do I claim this benefit?`,  answer: `You can apply for most benefits through GOV.UK or your local Jobcentre Plus. Some benefits require an online application; others may require a phone call or paper form.` },
  ],
  'stock-unit-calculator': [
    { question: `What does the Livestock Stock Unit Calculator do?`,  answer: `Calculate total livestock units for cattle, sheep, pigs and horses. See land requirement at 2 SU/ha.` },
    { question: `Are these based on Defra rates?`,  answer: `Where applicable, this calculator uses rates and data from Defra, the Rural Payments Agency and industry standard references for UK agriculture.` },
    { question: `Does this account for regional variations?`,  answer: `UK farming conditions vary by region, soil type and climate. This calculator provides national average figures — adjust for your specific location and circumstances.` },
  ],
  'agricultural-worker-wage-calculator': [
    { question: `What does the Agricultural Worker Minimum Wage Calculator do?`,  answer: `Calculate agricultural wages by AWO grade (1-6). Includes overtime at 1.5x and holiday entitlement.` },
    { question: `Are these based on Defra rates?`,  answer: `Where applicable, this calculator uses rates and data from Defra, the Rural Payments Agency and industry standard references for UK agriculture.` },
    { question: `Does this account for regional variations?`,  answer: `UK farming conditions vary by region, soil type and climate. This calculator provides national average figures — adjust for your specific location and circumstances.` },
  ],
  'mean-median-mode-calculator': [
    { question: `What does the Mean, Median & Mode Calculator do?`,  answer: `Calculate mean, median, mode, range, sum, min and max from a set of numbers. Shows sorted data.` },
    { question: `How accurate are the results?`,  answer: `This calculator uses standard mathematical algorithms and provides results accurate to the precision shown. For very large numbers or high-precision requirements, results are rounded to a reasonable number of decimal places.` },
    { question: `Can I use this for schoolwork?`,  answer: `Yes. This calculator is suitable for GCSE, A-level and university-level mathematics. It follows standard mathematical conventions used in UK education.` },
  ],
  'prime-number-calculator': [
    { question: `What does the Prime Number Checker do?`,  answer: `Check if a number is prime, find prime factorisation, and list primes up to N.` },
    { question: `How accurate are the results?`,  answer: `This calculator uses standard mathematical algorithms and provides results accurate to the precision shown. For very large numbers or high-precision requirements, results are rounded to a reasonable number of decimal places.` },
    { question: `Can I use this for schoolwork?`,  answer: `Yes. This calculator is suitable for GCSE, A-level and university-level mathematics. It follows standard mathematical conventions used in UK education.` },
  ],
  'waist-hip-ratio-calculator': [
    { question: `What does the Waist-to-Hip Ratio Calculator do?`,  answer: `Calculate your waist-to-hip ratio and cardiovascular disease risk using WHO guidelines.` },
    { question: `Is this medical advice?`,  answer: `No. This calculator is for informational purposes only and does not constitute medical advice. Always consult your GP or an appropriate healthcare professional for medical guidance.` },
    { question: `Are the reference values from the NHS?`,  answer: `Where applicable, this calculator uses reference values and guidelines from the NHS and other UK health authorities. Individual needs may vary based on personal health circumstances.` },
  ],
  'raised-bed-calculator': [
    { question: `What does the Raised Bed Soil Calculator do?`,  answer: `Calculate soil, bags and sleepers needed for raised garden beds with common size presets.` },
    { question: `Does this include delivery costs?`,  answer: `This calculator estimates material quantities and approximate costs. Delivery charges vary by supplier, quantity and location. Bulk orders often qualify for free or reduced delivery.` },
    { question: `When is the best time for this project?`,  answer: `Timing depends on the specific project. Generally, spring and autumn are ideal for lawn and planting work, while hard landscaping can be done year-round in dry conditions.` },
  ],
  'fence-paint-calculator': [
    { question: `What does the Fence Paint Calculator do?`,  answer: `Calculate fence paint or stain needed based on panels, height and number of coats.` },
    { question: `Does this include delivery costs?`,  answer: `This calculator estimates material quantities and approximate costs. Delivery charges vary by supplier, quantity and location. Bulk orders often qualify for free or reduced delivery.` },
    { question: `When is the best time for this project?`,  answer: `Timing depends on the specific project. Generally, spring and autumn are ideal for lawn and planting work, while hard landscaping can be done year-round in dry conditions.` },
  ],
  'clothing-size-converter': [
    { question: `What does the Clothing Size Converter (UK/EU/US) do?`,  answer: `Convert clothing sizes between UK, EU and US for women and men. Includes body measurements.` },
    { question: `Is this calculator free to use?`,  answer: `Yes. All calculators on Calks.uk are completely free to use. No account or registration is required. All calculations run in your browser — no data is collected.` },
    { question: `Can I use this on my phone?`,  answer: `Yes. All our calculators are fully responsive and work on smartphones, tablets and desktop computers. The interface adapts to your screen size automatically.` },
  ],
  'volume-converter': [
    { question: `What does the Volume Converter — Litres, Gallons & More do?`,  answer: `Convert between ml, litres, pints, gallons, cups, tablespoons and cubic metres.` },
    { question: `Is this calculator free to use?`,  answer: `Yes. All calculators on Calks.uk are completely free to use. No account or registration is required. All calculations run in your browser — no data is collected.` },
    { question: `Can I use this on my phone?`,  answer: `Yes. All our calculators are fully responsive and work on smartphones, tablets and desktop computers. The interface adapts to your screen size automatically.` },
  ],
  'birthday-calculator': [
    { question: `What does the Birthday Calculator do?`,  answer: `Find your day of birth, star sign, Chinese zodiac, days alive and upcoming milestone birthdays.` },
    { question: `Is this calculator free to use?`,  answer: `Yes. All calculators on Calks.uk are completely free to use. No account or registration is required. All calculations run in your browser — no data is collected.` },
    { question: `Can I use this on my phone?`,  answer: `Yes. All our calculators are fully responsive and work on smartphones, tablets and desktop computers. The interface adapts to your screen size automatically.` },
  ],
  'car-insurance-estimate-calculator': [
    { question: `What does the Car Insurance Estimate Calculator do?`,  answer: `Estimate car insurance premiums by age, cover level, no claims bonus, insurance group and mileage.` },
    { question: `Are these actual quotes?`,  answer: `No. This calculator provides estimates based on typical UK insurance factors. Actual premiums depend on your specific circumstances. Always compare quotes from multiple insurers.` },
    { question: `Is insurance required by law?`,  answer: `Some insurance is legally required in the UK — such as motor insurance, employers\' liability insurance and buildings insurance (if you have a mortgage). Other types are optional but strongly recommended.` },
  ],
  'home-insurance-calculator': [
    { question: `What does the Home Insurance Estimate Calculator do?`,  answer: `Estimate home insurance premiums for buildings, contents or combined cover by property type.` },
    { question: `Are these actual quotes?`,  answer: `No. This calculator provides estimates based on typical UK insurance factors. Actual premiums depend on your specific circumstances. Always compare quotes from multiple insurers.` },
    { question: `Is insurance required by law?`,  answer: `Some insurance is legally required in the UK — such as motor insurance, employers\' liability insurance and buildings insurance (if you have a mortgage). Other types are optional but strongly recommended.` },
  ],
  'critical-illness-calculator': [
    { question: `What does the Critical Illness Cover Calculator do?`,  answer: `Estimate critical illness insurance premiums by age, cover amount, term and smoker status.` },
    { question: `Are these actual quotes?`,  answer: `No. This calculator provides estimates based on typical UK insurance factors. Actual premiums depend on your specific circumstances. Always compare quotes from multiple insurers.` },
    { question: `Is insurance required by law?`,  answer: `Some insurance is legally required in the UK — such as motor insurance, employers\' liability insurance and buildings insurance (if you have a mortgage). Other types are optional but strongly recommended.` },
  ],
  'property-cgt-calculator': [
    { question: `What does the Capital Gains Tax on Property Calculator do?`,  answer: `Calculate CGT on residential property sales with PPR relief, costs and improvements deductions.` },
    { question: `Is this calculator updated for the 2026/27 tax year?`,  answer: `Yes. This calculator uses the latest HMRC rates and thresholds for the 2026/27 UK tax year, which runs from 6 April 2026 to 5 April 2026. Rates are verified against official HMRC publications.` },
    { question: `Do I need to tell HMRC about this?`,  answer: `Whether you need to report to HMRC depends on your individual circumstances. If you are unsure, check GOV.UK or contact HMRC directly. This calculator provides estimates for guidance only.` },
  ],
  'weighted-grade-calculator': [
    { question: `What does the Weighted Average Grade Calculator do?`,  answer: `Calculate weighted average from assessment components with different weightings. See UK degree classification.` },
    { question: `Is this based on current student finance rates?`,  answer: `Yes. This calculator uses Student Loans Company rates and thresholds for the 2026/27 academic and financial year. Thresholds and interest rates are updated annually.` },
    { question: `Which student loan plan am I on?`,  answer: `Plan 1 applies if you started before September 2012 (England/Wales) or are from Northern Ireland. Plan 2 applies from September 2012 in England/Wales. Plan 4 is for Scotland. Plan 5 applies from September 2023.` },
  ],
  'cost-of-living-comparison-calculator': [
    { question: `What does the UK Cost of Living Comparison do?`,  answer: `Compare cost of living between UK cities. See rent, food, transport differences and equivalent salary.` },
    { question: `Are visa fees up to date?`,  answer: `This calculator uses the current UK visa and immigration fees as published by UK Visas and Immigration (UKVI). Fees are reviewed periodically — check GOV.UK for the very latest amounts.` },
    { question: `Does this include the Immigration Health Surcharge?`,  answer: `Yes. The Immigration Health Surcharge (IHS) is included in the total cost calculation where applicable. The current IHS rate is £1,035 per year for most visa categories.` },
  ],
  'pension-annual-allowance-calculator': [
    { question: `What does the Pension Annual Allowance Calculator do?`,  answer: `Check your pension annual allowance (£60K), tapered allowance and MPAA. See if you face a tax charge.` },
    { question: `Are these figures guaranteed?`,  answer: `No. Pension projections are estimates based on assumed growth rates and current contribution levels. Actual returns depend on investment performance, fees and future policy changes.` },
    { question: `What is the pension annual allowance?`,  answer: `The pension annual allowance for 2026/27 is £60,000. This is the maximum you can contribute (including employer contributions) and receive tax relief. The allowance is tapered for high earners.` },
  ],
  'state-pension-age-calculator': [
    { question: `What does the State Pension Age Calculator do?`,  answer: `Find your State Pension age based on date of birth. See exact date and days remaining.` },
    { question: `Are these figures guaranteed?`,  answer: `No. Pension projections are estimates based on assumed growth rates and current contribution levels. Actual returns depend on investment performance, fees and future policy changes.` },
    { question: `What is the pension annual allowance?`,  answer: `The pension annual allowance for 2026/27 is £60,000. This is the maximum you can contribute (including employer contributions) and receive tax relief. The allowance is tapered for high earners.` },
  ],
  'student-loan-early-repay-calculator': [
    { question: `What does the Should I Repay Student Loan Early? do?`,  answer: `Compare total cost of normal repayments vs lump sum. See if early repayment saves money or wastes it.` },
    { question: `Does this use current UK interest rates?`,  answer: `You can enter any interest rate to model different scenarios. The Bank of England base rate and FCA guidelines influence typical lending rates available in the UK market.` },
    { question: `Should I get professional debt advice?`,  answer: `If you are struggling with debt, free professional advice is available from StepChange (0800 138 1111), Citizens Advice, and the National Debtline (0808 808 4000). This calculator provides estimates only.` },
  ],
  'pension-pot-calculator': [
    { question: `What does the How Much Pension Do I Need? do?`,  answer: `Calculate the pension pot needed for your target retirement income using drawdown, 4% rule or annuity.` },
    { question: `How big a pension pot do I really need?`,  answer: `Pensions and Lifetime Savings Association (PLSA) UK Retirement Living Standards (2026): Minimum £14,400/year (couple £22,400) — covers essentials only. Moderate £31,300 (couple £43,100) — annual holiday, hobbies. Comfortable £43,100 (couple £59,000) — multiple holidays, replacing car every 5 years. For 'moderate' lifestyle from age 67, you need a pension pot of ~£280k-£450k (using 4% drawdown rule), plus full State Pension (£12,547.60). For 'comfortable', target £600k+.` },
    { question: `What's a realistic savings rate?`,  answer: `Rule of thumb: save half your starting age as a % of income. Start at 25 → save 12.5%; at 35 → 17.5%; at 45 → 22.5%. With employer match of 3-5%, you need to personally contribute 7.5-19.5% extra. The State Pension alone (~£12,500) replaces only ~25-30% of average UK earnings. To replace 70% of pre-retirement income (typical 'comfortable' target), you need workplace + personal pension of ~40-45% replacement, which requires 15-20% of salary over 40 years.` },
    { question: `Should I have a separate pension and ISA?`,  answer: `Yes — they're tax-complementary. Pension: tax relief on the way in, taxed (most) on the way out. ISA: post-tax money in, tax-free out. Higher-rate taxpayers usually win on pension (40% relief in, 20% basic rate out at retirement = 20% net gain). Use ISA for: emergency fund, mid-life goals (kids' uni, house deposit). Lifetime ISA gives 25% bonus AND tax-free withdrawals at 60. Optimal mix: maximise employer pension match first, then LISA (under 40), then ISA, then more pension.` },

  ],
  'junior-isa-calculator': [
    { question: `What does the Junior ISA Calculator do?`,  answer: `Calculate how much a Junior ISA will be worth when your child turns 18. Tax-free growth with £9,000/year limit.` },
    { question: `Is this calculator suitable for financial decisions?`,  answer: `This calculator provides estimates for guidance only. Investment returns are not guaranteed and your capital is at risk. Consider seeking independent financial advice before making investment decisions.` },
    { question: `Are ISA contributions tax-free?`,  answer: `Yes. The annual ISA allowance for 2026/27 is £20,000. Any interest, dividends or capital gains within an ISA are completely tax-free.` },
  ],
  'zero-hours-calculator': [
    { question: `What does the Zero-Hours Contract Earnings Calculator do?`,  answer: `Calculate annual earnings, tax and holiday pay accrual on a zero-hours contract. NMW check included.` },
    { question: `Is this calculator based on 2026/27 rates?`,  answer: `Yes. This calculator uses the current 2026/27 UK tax year rates for income tax, National Insurance and other deductions, effective from 6 April 2026.` },
    { question: `Does this include pension contributions?`,  answer: `This calculator can factor in workplace pension contributions. Under auto-enrolment, the minimum is 8% total (5% employee + 3% employer) of qualifying earnings.` },
  ],
  'agency-worker-calculator': [
    { question: `What does the Agency Worker Pay Calculator do?`,  answer: `Calculate take-home pay as an agency worker. See what you actually earn after agency margin and deductions.` },
    { question: `Is this calculator based on 2026/27 rates?`,  answer: `Yes. This calculator uses the current 2026/27 UK tax year rates for income tax, National Insurance and other deductions, effective from 6 April 2026.` },
    { question: `Does this include pension contributions?`,  answer: `This calculator can factor in workplace pension contributions. Under auto-enrolment, the minimum is 8% total (5% employee + 3% employer) of qualifying earnings.` },
  ],
  'settlement-agreement-calculator': [
    { question: `What does the Settlement Agreement Calculator do?`,  answer: `Estimate settlement package: redundancy, notice, holiday, ex-gratia and tax treatment (£30K tax-free).` },
    { question: `Is this calculator based on 2026/27 rates?`,  answer: `Yes. This calculator uses the current 2026/27 UK tax year rates for income tax, National Insurance and other deductions, effective from 6 April 2026.` },
    { question: `Does this include pension contributions?`,  answer: `This calculator can factor in workplace pension contributions. Under auto-enrolment, the minimum is 8% total (5% employee + 3% employer) of qualifying earnings.` },
  ],
  'buy-to-let-mortgage-calculator': [
    { question: `What does the Buy-to-Let Mortgage Calculator do?`,  answer: `Calculate BTL mortgage payments (interest-only and repayment). Check rental coverage stress test.` },
    { question: `Rental cover requirements — the 145% rule.`,  answer: `Since 2017 PRA rules, lenders must check that rental income covers 145% of mortgage interest at a stressed rate of 5.5% (for higher-rate taxpayer landlords). A £200k BTL mortgage at 5.5% costs £917/month interest; required rent = £917 × 1.45 = £1,330/month. For limited company landlords, the stress is 125%. Some lenders allow 'top-slicing' — using personal income to make up any rental shortfall.` },
    { question: `Limited company vs personal BTL — what's the cost?`,  answer: `Personal BTL: rental profit taxed at income tax rates (20-45%) but only 20% relief on mortgage interest (Section 24). Limited company SPV: Corporation Tax (19-25%) on profit AFTER full mortgage interest deduction. For higher-rate taxpayer landlords with significant mortgages, SPV typically saves £2,000-£5,000/year per property. SETUP: ~£100-£300 to incorporate, ~£800-£1,500/year in accounting. Best for 3+ property portfolios or properties with high LTV.` },
    { question: `Minimum deposit for BTL.`,  answer: `Typically 25% (75% LTV maximum), occasionally 20% (80% LTV) for experienced landlords. Some specialist lenders go to 85% LTV but rates are much higher. HMO (Houses in Multiple Occupation) and Multi-Unit Block require 30-40% deposit. Limited company BTL: similar 75% LTV cap. First-time landlords face stricter requirements: higher deposit (25-30%), need to show personal income £25-£30k+, and may need to live in the area or have property management experience.` },

  ],
  'house-price-sqft-calculator': [
    { question: `What does the House Price per Square Foot Calculator do?`,  answer: `Calculate price per square foot/metre to compare property value. See how it compares to UK averages.` },
    { question: `Is this based on current interest rates?`,  answer: `You can enter any interest rate to model different scenarios. Check the Bank of England base rate and current mortgage deals from lenders for the latest rates.` },
    { question: `Should I get professional advice?`,  answer: `This calculator provides estimates for guidance only. For a formal mortgage offer, speak to a mortgage broker or lender who can assess your full circumstances and provide personalised advice.` },
  ],
  'lease-extension-calculator': [
    { question: `What does the Leasehold Extension Calculator do?`,  answer: `Estimate lease extension premium including marriage value, ground rent and professional fees.` },
    { question: `Is this based on current interest rates?`,  answer: `You can enter any interest rate to model different scenarios. Check the Bank of England base rate and current mortgage deals from lenders for the latest rates.` },
    { question: `Should I get professional advice?`,  answer: `This calculator provides estimates for guidance only. For a formal mortgage offer, speak to a mortgage broker or lender who can assess your full circumstances and provide personalised advice.` },
  ],
  'student-loan-interest-calculator': [
    { question: `What does the Student Loan Interest Calculator do?`,  answer: `Calculate your student loan interest rate by income. See how fast your balance grows with compound interest.` },
    { question: `Does this use current UK interest rates?`,  answer: `You can enter any interest rate to model different scenarios. The Bank of England base rate and FCA guidelines influence typical lending rates available in the UK market.` },
    { question: `Should I get professional debt advice?`,  answer: `If you are struggling with debt, free professional advice is available from StepChange (0800 138 1111), Citizens Advice, and the National Debtline (0808 808 4000). This calculator provides estimates only.` },
  ],
  'debt-consolidation-calculator': [
    { question: `What does the Debt Consolidation Calculator do?`,  answer: `Compare current debt payments vs a consolidation loan. See if you save on monthly payments and total interest.` },
    { question: `Does this use current UK interest rates?`,  answer: `You can enter any interest rate to model different scenarios. The Bank of England base rate and FCA guidelines influence typical lending rates available in the UK market.` },
    { question: `Should I get professional debt advice?`,  answer: `If you are struggling with debt, free professional advice is available from StepChange (0800 138 1111), Citizens Advice, and the National Debtline (0808 808 4000). This calculator provides estimates only.` },
  ],
  'postgraduate-loan-calculator': [
    { question: `What does the Postgraduate Loan Repayment Calculator do?`,  answer: `Calculate postgraduate loan repayments at 6% above £21,000. See if your balance is growing or shrinking.` },
    { question: `Does this use current UK interest rates?`,  answer: `You can enter any interest rate to model different scenarios. The Bank of England base rate and FCA guidelines influence typical lending rates available in the UK market.` },
    { question: `Should I get professional debt advice?`,  answer: `If you are struggling with debt, free professional advice is available from StepChange (0800 138 1111), Citizens Advice, and the National Debtline (0808 808 4000). This calculator provides estimates only.` },
  ],
  'epc-calculator': [
    { question: `What does the EPC Rating Improvement Calculator do?`,  answer: `Estimate your EPC rating and see which upgrades will improve it most. Includes costs and annual savings.` },
    { question: `Does this reflect the current energy price cap?`,  answer: `This calculator uses representative energy prices. The Ofgem energy price cap changes quarterly — check Ofgem\'s website for the latest cap level applicable to your region and payment method.` },
    { question: `Can I save money by switching tariff?`,  answer: `Potentially yes. The energy market offers various fixed and variable tariffs. Use a comparison site authorised by Ofgem (such as Ofgem\'s own comparison tool) to check if switching could save you money.` },
  ],
  'bathroom-cost-calculator': [
    { question: `What does the Bathroom Cost Calculator do?`,  answer: `Estimate bathroom renovation costs for budget, mid-range and premium finishes with optional extras.` },
    { question: `Does this include waste allowance?`,  answer: `Yes. Most building material calculations include a standard 10% waste allowance. You can adjust this figure depending on the complexity of your project and cutting requirements.` },
    { question: `Are prices accurate?`,  answer: `Material prices are indicative estimates based on average UK prices. Actual costs vary by region, supplier, brand and current market conditions. Always get quotes from local suppliers.` },
  ],
  'kitchen-cost-calculator': [
    { question: `What does the Kitchen Cost Calculator do?`,  answer: `Estimate kitchen installation costs by budget level. Includes units, worktops, appliances and labour.` },
    { question: `Does this include waste allowance?`,  answer: `Yes. Most building material calculations include a standard 10% waste allowance. You can adjust this figure depending on the complexity of your project and cutting requirements.` },
    { question: `Are prices accurate?`,  answer: `Material prices are indicative estimates based on average UK prices. Actual costs vary by region, supplier, brand and current market conditions. Always get quotes from local suppliers.` },
  ],
  'timber-calculator': [
    { question: `What does the Timber Calculator — Board Feet & Cost do?`,  answer: `Calculate timber volume, total length and cost for construction projects. Common size presets included.` },
    { question: `Does this include waste allowance?`,  answer: `Yes. Most building material calculations include a standard 10% waste allowance. You can adjust this figure depending on the complexity of your project and cutting requirements.` },
    { question: `Are prices accurate?`,  answer: `Material prices are indicative estimates based on average UK prices. Actual costs vary by region, supplier, brand and current market conditions. Always get quotes from local suppliers.` },
  ],
  'underfloor-heating-calculator': [
    { question: `What does the Underfloor Heating Calculator do?`,  answer: `Compare water, electric mat and cable underfloor heating. See install costs and running costs vs radiators.` },
    { question: `Does this include waste allowance?`,  answer: `Yes. Most building material calculations include a standard 10% waste allowance. You can adjust this figure depending on the complexity of your project and cutting requirements.` },
    { question: `Are prices accurate?`,  answer: `Material prices are indicative estimates based on average UK prices. Actual costs vary by region, supplier, brand and current market conditions. Always get quotes from local suppliers.` },
  ],
  'student-allowance-calculator': [
    { question: `What does the Bursary & Scholarship Impact Calculator do?`,  answer: `Calculate total student support from maintenance loan plus NHS, teacher training, DSA and other bursaries.` },
    { question: `Is this based on current student finance rates?`,  answer: `Yes. This calculator uses Student Loans Company rates and thresholds for the 2026/27 academic and financial year. Thresholds and interest rates are updated annually.` },
    { question: `Which student loan plan am I on?`,  answer: `Plan 1 applies if you started before September 2012 (England/Wales) or are from Northern Ireland. Plan 2 applies from September 2012 in England/Wales. Plan 4 is for Scotland. Plan 5 applies from September 2023.` },
  ],
  'night-shift-calculator': [
    { question: `What does the Night Shift Allowance Calculator do?`,  answer: `Calculate night shift premium at 15-100% rates. See annual extra earnings from night work.` },
    { question: `Is this calculator based on 2026/27 rates?`,  answer: `Yes. This calculator uses the current 2026/27 UK tax year rates for income tax, National Insurance and other deductions, effective from 6 April 2026.` },
    { question: `Does this include pension contributions?`,  answer: `This calculator can factor in workplace pension contributions. Under auto-enrolment, the minimum is 8% total (5% employee + 3% employer) of qualifying earnings.` },
  ],
  'benefits-in-kind-calculator': [
    { question: `What does the Benefits in Kind (P11D) Calculator do?`,  answer: `Calculate tax on company benefits — car, medical insurance, gym, phone and more. See monthly tax impact.` },
    { question: `Is this calculator based on 2026/27 rates?`,  answer: `Yes. This calculator uses the current 2026/27 UK tax year rates for income tax, National Insurance and other deductions, effective from 6 April 2026.` },
    { question: `Does this include pension contributions?`,  answer: `This calculator can factor in workplace pension contributions. Under auto-enrolment, the minimum is 8% total (5% employee + 3% employer) of qualifying earnings.` },
  ],
  'regular-savings-calculator': [
    { question: `What does the Regular Savings Calculator do?`,  answer: `Calculate returns on a regular saver account with monthly deposits. See effective vs headline rate.` },
    { question: `Is this calculator suitable for financial decisions?`,  answer: `This calculator provides estimates for guidance only. Investment returns are not guaranteed and your capital is at risk. Consider seeking independent financial advice before making investment decisions.` },
    { question: `Are ISA contributions tax-free?`,  answer: `Yes. The annual ISA allowance for 2026/27 is £20,000. Any interest, dividends or capital gains within an ISA are completely tax-free.` },
  ],
  'business-mileage-calculator': [
    { question: `What does the Business Mileage Calculator do?`,  answer: `Compare HMRC mileage allowance vs actual fuel costs. See if you profit or lose from the 45p/25p rates.` },
    { question: `Is this calculator based on 2026/27 rates?`,  answer: `Yes. This calculator uses the current 2026/27 UK tax year rates for income tax, National Insurance and other deductions, effective from 6 April 2026.` },
    { question: `Does this include pension contributions?`,  answer: `This calculator can factor in workplace pension contributions. Under auto-enrolment, the minimum is 8% total (5% employee + 3% employer) of qualifying earnings.` },
  ],
  'wealth-growth-calculator': [
    { question: `What does the Wealth Growth Projector do?`,  answer: `Project wealth growth over time with annual savings and compound returns. See milestones (£100K, £1M).` },
    { question: `Is this calculator suitable for financial decisions?`,  answer: `This calculator provides estimates for guidance only. Investment returns are not guaranteed and your capital is at risk. Consider seeking independent financial advice before making investment decisions.` },
    { question: `Are ISA contributions tax-free?`,  answer: `Yes. The annual ISA allowance for 2026/27 is £20,000. Any interest, dividends or capital gains within an ISA are completely tax-free.` },
  ],
  'cgt-on-shares-calculator': [
    { question: `What does the CGT on Shares Calculator do?`,  answer: `Calculate capital gains tax on share sales. Includes annual exempt amount, basic/higher rates and ISA tip.` },
    { question: `Is this calculator suitable for financial decisions?`,  answer: `This calculator provides estimates for guidance only. Investment returns are not guaranteed and your capital is at risk. Consider seeking independent financial advice before making investment decisions.` },
    { question: `Are ISA contributions tax-free?`,  answer: `Yes. The annual ISA allowance for 2026/27 is £20,000. Any interest, dividends or capital gains within an ISA are completely tax-free.` },
  ],
  'dividend-income-calculator': [
    { question: `What does the Dividend Income Calculator do?`,  answer: `Calculate annual dividend income and project portfolio growth with or without reinvestment (DRIP).` },
    { question: `Is this calculator suitable for financial decisions?`,  answer: `This calculator provides estimates for guidance only. Investment returns are not guaranteed and your capital is at risk. Consider seeking independent financial advice before making investment decisions.` },
    { question: `Are ISA contributions tax-free?`,  answer: `Yes. The annual ISA allowance for 2026/27 is £20,000. Any interest, dividends or capital gains within an ISA are completely tax-free.` },
  ],
  'non-dom-tax-calculator': [
    { question: `What does the Non-Dom Tax Calculator (FIG Regime) do?`,  answer: `Calculate tax under the new FIG regime for non-domiciled UK residents. 4-year foreign income exemption.` },
    { question: `Is this calculator updated for the 2026/27 tax year?`,  answer: `Yes. This calculator uses the latest HMRC rates and thresholds for the 2026/27 UK tax year, which runs from 6 April 2026 to 5 April 2026. Rates are verified against official HMRC publications.` },
    { question: `Do I need to tell HMRC about this?`,  answer: `Whether you need to report to HMRC depends on your individual circumstances. If you are unsure, check GOV.UK or contact HMRC directly. This calculator provides estimates for guidance only.` },
  ],
  'annual-investment-allowance-calculator': [
    { question: `What does the Annual Investment Allowance Calculator do?`,  answer: `Calculate AIA tax relief on plant & machinery spending. 100% deduction on first £1M.` },
    { question: `Is this suitable for my business?`,  answer: `This calculator provides general estimates based on standard UK business rates and rules. Every business is different — consult your accountant for advice specific to your circumstances.` },
    { question: `Does this use 2026/27 tax rates?`,  answer: `Yes. All rates and thresholds are based on the current 2026/27 UK tax year. Corporation Tax main rate is 25% for profits over £250,000, with a 19% small profits rate.` },
  ],
  'mortgage-interest-rate-calculator': [
    { question: `What does the Mortgage Interest Rate Comparison do?`,  answer: `Compare monthly payments at different interest rates. See how rate changes affect your mortgage.` },
    { question: `Is this based on current interest rates?`,  answer: `You can enter any interest rate to model different scenarios. Check the Bank of England base rate and current mortgage deals from lenders for the latest rates.` },
    { question: `Should I get professional advice?`,  answer: `This calculator provides estimates for guidance only. For a formal mortgage offer, speak to a mortgage broker or lender who can assess your full circumstances and provide personalised advice.` },
  ],
  'sipp-calculator': [
    { question: `What does the SIPP Calculator — Self-Invested Pension do?`,  answer: `Project your Self-Invested Personal Pension with tax relief, employer contributions and growth.` },
    { question: `Are these figures guaranteed?`,  answer: `No. Pension projections are estimates based on assumed growth rates and current contribution levels. Actual returns depend on investment performance, fees and future policy changes.` },
    { question: `What is the pension annual allowance?`,  answer: `The pension annual allowance for 2026/27 is £60,000. This is the maximum you can contribute (including employer contributions) and receive tax relief. The allowance is tapered for high earners.` },
  ],
  'tax-credits-calculator': [
    { question: `What does the Tax Credits Calculator (Legacy) do?`,  answer: `Calculate Working Tax Credit and Child Tax Credit for existing claimants. Includes childcare element.` },
    { question: `Are benefit amounts accurate?`,  answer: `This calculator uses the published 2026/27 benefit rates. However, actual entitlements depend on a full assessment by the Department for Work and Pensions (DWP) and may differ from estimates.` },
    { question: `How do I claim this benefit?`,  answer: `You can apply for most benefits through GOV.UK or your local Jobcentre Plus. Some benefits require an online application; others may require a phone call or paper form.` },
  ],
  'stocks-shares-isa-calculator': [
    { question: `What does the Stocks & Shares ISA Calculator do?`,  answer: `Project Stocks & Shares ISA growth with capital appreciation and dividends. See tax saved vs taxable account.` },
    { question: `Is this calculator suitable for financial decisions?`,  answer: `This calculator provides estimates for guidance only. Investment returns are not guaranteed and your capital is at risk. Consider seeking independent financial advice before making investment decisions.` },
    { question: `Are ISA contributions tax-free?`,  answer: `Yes. The annual ISA allowance for 2026/27 is £20,000. Any interest, dividends or capital gains within an ISA are completely tax-free.` },
  ],
  'epc-rating-comparison-calculator': [
    { question: `What does the EPC Band Comparison Calculator do?`,  answer: `Compare energy costs between EPC bands. See annual savings from upgrading your rating.` },
    { question: `Does this reflect the current energy price cap?`,  answer: `This calculator uses representative energy prices. The Ofgem energy price cap changes quarterly — check Ofgem\'s website for the latest cap level applicable to your region and payment method.` },
    { question: `Can I save money by switching tariff?`,  answer: `Potentially yes. The energy market offers various fixed and variable tariffs. Use a comparison site authorised by Ofgem (such as Ofgem\'s own comparison tool) to check if switching could save you money.` },
  ],
  'help-to-save-calculator': [
    { question: `What does the Help to Save Calculator do?`,  answer: `Calculate Help to Save returns with the 50% government bonus. Max £50/month for 4 years.` },
    { question: `Is this calculator suitable for financial decisions?`,  answer: `This calculator provides estimates for guidance only. Investment returns are not guaranteed and your capital is at risk. Consider seeking independent financial advice before making investment decisions.` },
    { question: `Are ISA contributions tax-free?`,  answer: `Yes. The annual ISA allowance for 2026/27 is £20,000. Any interest, dividends or capital gains within an ISA are completely tax-free.` },
  ],
  'ns-i-savings-calculator': [
    { question: `What does the NS&I Savings Calculator do?`,  answer: `Calculate savings interest with different compounding frequencies. See AER vs nominal rate.` },
    { question: `Is this calculator suitable for financial decisions?`,  answer: `This calculator provides estimates for guidance only. Investment returns are not guaranteed and your capital is at risk. Consider seeking independent financial advice before making investment decisions.` },
    { question: `Are ISA contributions tax-free?`,  answer: `Yes. The annual ISA allowance for 2026/27 is £20,000. Any interest, dividends or capital gains within an ISA are completely tax-free.` },
  ],
  'bmi-children-calculator': [
    { question: `What does the BMI Calculator for Children do?`,  answer: `Calculate BMI for children aged 2-18 with age and gender-adjusted interpretation.` },
    { question: `Is this medical advice?`,  answer: `No. This calculator is for informational purposes only and does not constitute medical advice. Always consult your GP or an appropriate healthcare professional for medical guidance.` },
    { question: `Are the reference values from the NHS?`,  answer: `Where applicable, this calculator uses reference values and guidelines from the NHS and other UK health authorities. Individual needs may vary based on personal health circumstances.` },
  ],
  'offset-mortgage-calculator': [
    { question: `What does the Offset Mortgage Calculator do?`,  answer: `Calculate interest saved by offsetting savings against your mortgage. See equivalent tax-free rate.` },
    { question: `Is this based on current interest rates?`,  answer: `You can enter any interest rate to model different scenarios. Check the Bank of England base rate and current mortgage deals from lenders for the latest rates.` },
    { question: `Should I get professional advice?`,  answer: `This calculator provides estimates for guidance only. For a formal mortgage offer, speak to a mortgage broker or lender who can assess your full circumstances and provide personalised advice.` },
  ],
  'ground-rent-calculator': [
    { question: `What does the Ground Rent Calculator do?`,  answer: `Calculate ground rent over time with escalation. Flag onerous rents. Includes doubling and RPI clauses.` },
    { question: `Is this based on current interest rates?`,  answer: `You can enter any interest rate to model different scenarios. Check the Bank of England base rate and current mortgage deals from lenders for the latest rates.` },
    { question: `Should I get professional advice?`,  answer: `This calculator provides estimates for guidance only. For a formal mortgage offer, speak to a mortgage broker or lender who can assess your full circumstances and provide personalised advice.` },
  ],
  'service-charge-calculator': [
    { question: `What does the Service Charge Calculator do?`,  answer: `Estimate your leasehold service charge from building costs. Includes insurance, maintenance and reserve fund.` },
    { question: `Is this based on current interest rates?`,  answer: `You can enter any interest rate to model different scenarios. Check the Bank of England base rate and current mortgage deals from lenders for the latest rates.` },
    { question: `Should I get professional advice?`,  answer: `This calculator provides estimates for guidance only. For a formal mortgage offer, speak to a mortgage broker or lender who can assess your full circumstances and provide personalised advice.` },
  ],
  'pension-consolidation-calculator': [
    { question: `What does the Pension Consolidation Calculator do?`,  answer: `Compare keeping multiple pension pots vs consolidating into one. See fee savings over time.` },
    { question: `Are these figures guaranteed?`,  answer: `No. Pension projections are estimates based on assumed growth rates and current contribution levels. Actual returns depend on investment performance, fees and future policy changes.` },
    { question: `What is the pension annual allowance?`,  answer: `The pension annual allowance for 2026/27 is £60,000. This is the maximum you can contribute (including employer contributions) and receive tax relief. The allowance is tapered for high earners.` },
  ],
  'employer-pension-contribution-calculator': [
    { question: `What does the Employer Pension Contribution Calculator do?`,  answer: `Calculate auto-enrolment pension contributions on qualifying earnings with tax relief.` },
    { question: `Are these figures guaranteed?`,  answer: `No. Pension projections are estimates based on assumed growth rates and current contribution levels. Actual returns depend on investment performance, fees and future policy changes.` },
    { question: `What is the pension annual allowance?`,  answer: `The pension annual allowance for 2026/27 is £60,000. This is the maximum you can contribute (including employer contributions) and receive tax relief. The allowance is tapered for high earners.` },
  ],
  'right-to-buy-calculator': [
    { question: `What does the Right to Buy Calculator do?`,  answer: `Calculate your Right to Buy discount for council/housing association properties. Up to 70% off.` },
    { question: `Is this based on current interest rates?`,  answer: `You can enter any interest rate to model different scenarios. Check the Bank of England base rate and current mortgage deals from lenders for the latest rates.` },
    { question: `Should I get professional advice?`,  answer: `This calculator provides estimates for guidance only. For a formal mortgage offer, speak to a mortgage broker or lender who can assess your full circumstances and provide personalised advice.` },
  ],
  'staircasing-calculator': [
    { question: `What does the Shared Ownership Staircasing Calculator do?`,  answer: `Calculate the cost of buying a bigger share of your shared ownership home and new rent.` },
    { question: `Is this based on current interest rates?`,  answer: `You can enter any interest rate to model different scenarios. Check the Bank of England base rate and current mortgage deals from lenders for the latest rates.` },
    { question: `Should I get professional advice?`,  answer: `This calculator provides estimates for guidance only. For a formal mortgage offer, speak to a mortgage broker or lender who can assess your full circumstances and provide personalised advice.` },
  ],
  'pension-lump-sum-calculator': [
    { question: `What does the Pension Lump Sum Calculator (PCLS) do?`,  answer: `Compare taking 0-100% as lump sum. See tax-free portion, tax on excess and remaining pot for drawdown.` },
    { question: `Are these figures guaranteed?`,  answer: `No. Pension projections are estimates based on assumed growth rates and current contribution levels. Actual returns depend on investment performance, fees and future policy changes.` },
    { question: `What is the pension annual allowance?`,  answer: `The pension annual allowance for 2026/27 is £60,000. This is the maximum you can contribute (including employer contributions) and receive tax relief. The allowance is tapered for high earners.` },
  ],
  'elm-payment-calculator': [
    { question: `What does the BPS/ELM Payment Calculator do?`,  answer: `Calculate Sustainable Farming Incentive and ELM payments for 10+ environmental actions.` },
    { question: `Are these based on Defra rates?`,  answer: `Where applicable, this calculator uses rates and data from Defra, the Rural Payments Agency and industry standard references for UK agriculture.` },
    { question: `Does this account for regional variations?`,  answer: `UK farming conditions vary by region, soil type and climate. This calculator provides national average figures — adjust for your specific location and circumstances.` },
  ],
  'farm-tenancy-calculator': [
    { question: `What does the Farm Tenancy Rent Review Calculator do?`,  answer: `Compare your farm rent to market rates. See rent as percentage of revenue for rent review preparation.` },
    { question: `Are these based on Defra rates?`,  answer: `Where applicable, this calculator uses rates and data from Defra, the Rural Payments Agency and industry standard references for UK agriculture.` },
    { question: `Does this account for regional variations?`,  answer: `UK farming conditions vary by region, soil type and climate. This calculator provides national average figures — adjust for your specific location and circumstances.` },
  ],
  'ev-salary-sacrifice-calculator': [
    { question: `What does the EV Salary Sacrifice Calculator do?`,  answer: `Calculate savings from EV salary sacrifice. See tax/NI savings, BiK at 3% and effective monthly cost.` },
    { question: `Is this calculator based on 2026/27 rates?`,  answer: `Yes. This calculator uses the current 2026/27 UK tax year rates for income tax, National Insurance and other deductions, effective from 6 April 2026.` },
    { question: `Does this include pension contributions?`,  answer: `This calculator can factor in workplace pension contributions. Under auto-enrolment, the minimum is 8% total (5% employee + 3% employer) of qualifying earnings.` },
  ],
  'ulez-calculator': [
    { question: `What does the ULEZ Compliance Checker do?`,  answer: `Check if your car is ULEZ compliant and calculate annual ULEZ and Congestion Charge costs.` },
    { question: `Does this use current UK rates?`,  answer: `Yes. This calculator uses the latest UK rates for vehicle tax, fuel duty and other motoring costs as of the 2026/27 financial year.` },
    { question: `Is this suitable for electric vehicles?`,  answer: `From April 2025, electric vehicles are no longer exempt from Vehicle Excise Duty (road tax). This calculator accounts for EV-specific rates where applicable.` },
  ],
  'car-import-duty-calculator': [
    { question: `What does the Car Import Duty Calculator do?`,  answer: `Calculate total UK landing cost for imported cars — duty, VAT, VED and type approval.` },
    { question: `Does this use current UK rates?`,  answer: `Yes. This calculator uses the latest UK rates for vehicle tax, fuel duty and other motoring costs as of the 2026/27 financial year.` },
    { question: `Is this suitable for electric vehicles?`,  answer: `From April 2025, electric vehicles are no longer exempt from Vehicle Excise Duty (road tax). This calculator accounts for EV-specific rates where applicable.` },
  ],
  'road-trip-cost-calculator': [
    { question: `What does the Road Trip Cost Calculator do?`,  answer: `Calculate fuel cost, driving time and cost per person for road trips. Split costs easily.` },
    { question: `Does this use current UK rates?`,  answer: `Yes. This calculator uses the latest UK rates for vehicle tax, fuel duty and other motoring costs as of the 2026/27 financial year.` },
    { question: `Is this suitable for electric vehicles?`,  answer: `From April 2025, electric vehicles are no longer exempt from Vehicle Excise Duty (road tax). This calculator accounts for EV-specific rates where applicable.` },
  ],
  'making-tax-digital-calculator': [
    { question: `What does the Making Tax Digital Readiness Calculator do?`,  answer: `Check if MTD for Income Tax applies to you. See deadlines, requirements and software costs.` },
    { question: `Is this calculator updated for the 2026/27 tax year?`,  answer: `Yes. This calculator uses the latest HMRC rates and thresholds for the 2026/27 UK tax year, which runs from 6 April 2026 to 5 April 2026. Rates are verified against official HMRC publications.` },
    { question: `Do I need to tell HMRC about this?`,  answer: `Whether you need to report to HMRC depends on your individual circumstances. If you are unsure, check GOV.UK or contact HMRC directly. This calculator provides estimates for guidance only.` },
  ],
  'tax-bracket-visualizer': [
    { question: `What does the Tax Bracket Visualizer do?`,  answer: `See your income split across tax bands with a visual bar. Highlights the 60% tax trap at £100-125K.` },
    { question: `Is this calculator updated for the 2026/27 tax year?`,  answer: `Yes. This calculator uses the latest HMRC rates and thresholds for the 2026/27 UK tax year, which runs from 6 April 2026 to 5 April 2026. Rates are verified against official HMRC publications.` },
    { question: `Do I need to tell HMRC about this?`,  answer: `Whether you need to report to HMRC depends on your individual circumstances. If you are unsure, check GOV.UK or contact HMRC directly. This calculator provides estimates for guidance only.` },
  ],
  'business-mileage-record-calculator': [
    { question: `What does the Business Mileage Log Calculator do?`,  answer: `Log business trips with dates and mileage. Calculate HMRC mileage allowance claim automatically.` },
    { question: `Is this suitable for my business?`,  answer: `This calculator provides general estimates based on standard UK business rates and rules. Every business is different — consult your accountant for advice specific to your circumstances.` },
    { question: `Does this use 2026/27 tax rates?`,  answer: `Yes. All rates and thresholds are based on the current 2026/27 UK tax year. Corporation Tax main rate is 25% for profits over £250,000, with a 19% small profits rate.` },
  ],
  'pension-sharing-divorce-calculator': [
    { question: `What does the Pension Sharing on Divorce Calculator do?`,  answer: `Calculate pension division in divorce. Compare sharing orders with different splits.` },
    { question: `Are these figures guaranteed?`,  answer: `No. Pension projections are estimates based on assumed growth rates and current contribution levels. Actual returns depend on investment performance, fees and future policy changes.` },
    { question: `What is the pension annual allowance?`,  answer: `The pension annual allowance for 2026/27 is £60,000. This is the maximum you can contribute (including employer contributions) and receive tax relief. The allowance is tapered for high earners.` },
  ],
  'working-hours-benefits-calculator': [
    { question: `What does the Working Hours & Benefits Threshold Calculator do?`,  answer: `Check which benefit thresholds you meet based on working hours. UC conditionality and WTC eligibility.` },
    { question: `Are benefit amounts accurate?`,  answer: `This calculator uses the published 2026/27 benefit rates. However, actual entitlements depend on a full assessment by the Department for Work and Pensions (DWP) and may differ from estimates.` },
    { question: `How do I claim this benefit?`,  answer: `You can apply for most benefits through GOV.UK or your local Jobcentre Plus. Some benefits require an online application; others may require a phone call or paper form.` },
  ],
  'inheritance-tax-pension-calculator': [
    { question: `What does the Inheritance Tax on Pensions Calculator (2027) do?`,  answer: `Compare IHT before and after April 2027 when pensions enter the estate. See extra tax liability.` },
    { question: `Is this calculator updated for the 2026/27 tax year?`,  answer: `Yes. This calculator uses the latest HMRC rates and thresholds for the 2026/27 UK tax year, which runs from 6 April 2026 to 5 April 2026. Rates are verified against official HMRC publications.` },
    { question: `Do I need to tell HMRC about this?`,  answer: `Whether you need to report to HMRC depends on your individual circumstances. If you are unsure, check GOV.UK or contact HMRC directly. This calculator provides estimates for guidance only.` },
  ],
  'mtd-readiness-calculator': [
    { question: `What does the MTD Readiness Checklist do?`,  answer: `Score your Making Tax Digital readiness across 10 key criteria. See what you still need to do.` },
    { question: `Is this suitable for my business?`,  answer: `This calculator provides general estimates based on standard UK business rates and rules. Every business is different — consult your accountant for advice specific to your circumstances.` },
    { question: `Does this use 2026/27 tax rates?`,  answer: `Yes. All rates and thresholds are based on the current 2026/27 UK tax year. Corporation Tax main rate is 25% for profits over £250,000, with a 19% small profits rate.` },
  ],
  'congestion-charge-calculator': [
    { question: `What does the London Congestion Charge Calculator do?`,  answer: `Calculate annual Congestion Charge cost. Check EV and Blue Badge exemptions.` },
    { question: `Does this use current UK rates?`,  answer: `Yes. This calculator uses the latest UK rates for vehicle tax, fuel duty and other motoring costs as of the 2026/27 financial year.` },
    { question: `Is this suitable for electric vehicles?`,  answer: `From April 2025, electric vehicles are no longer exempt from Vehicle Excise Duty (road tax). This calculator accounts for EV-specific rates where applicable.` },
  ],
  'a-level-grade-calculator': [
    { question: `What does the A-Level Grade Calculator do?`,  answer: `Calculate UCAS tariff points from A-Level grades. See which universities your grades qualify for.` },
    { question: `Is this based on current student finance rates?`,  answer: `Yes. This calculator uses Student Loans Company rates and thresholds for the 2026/27 academic and financial year. Thresholds and interest rates are updated annually.` },
    { question: `Which student loan plan am I on?`,  answer: `Plan 1 applies if you started before September 2012 (England/Wales) or are from Northern Ireland. Plan 2 applies from September 2012 in England/Wales. Plan 4 is for Scotland. Plan 5 applies from September 2023.` },
  ],
  'student-loan-plan4-calculator': [
    { question: `What does the Student Loan Plan 4 (Scotland) Calculator do?`,  answer: `Calculate Plan 4 (Scottish) student loan repayments at 9% above the £33,795 threshold for 2026/27. See monthly and annual deductions.` },
    { question: `Does this use current UK interest rates?`,  answer: `You can enter any interest rate to model different scenarios. The Bank of England base rate and FCA guidelines influence typical lending rates available in the UK market.` },
    { question: `Should I get professional debt advice?`,  answer: `If you are struggling with debt, free professional advice is available from StepChange (0800 138 1111), Citizens Advice, and the National Debtline (0808 808 4000). This calculator provides estimates only.` },
  ],
  'crypto-carf-calculator': [
    { question: `What does the Crypto Tax CARF Calculator do?`,  answer: `Track crypto disposals, calculate CGT and understand CARF automatic reporting from 2026.` },
    { question: `Is this calculator updated for the 2026/27 tax year?`,  answer: `Yes. This calculator uses the latest HMRC rates and thresholds for the 2026/27 UK tax year, which runs from 6 April 2026 to 5 April 2026. Rates are verified against official HMRC publications.` },
    { question: `Do I need to tell HMRC about this?`,  answer: `Whether you need to report to HMRC depends on your individual circumstances. If you are unsure, check GOV.UK or contact HMRC directly. This calculator provides estimates for guidance only.` },
  ],
  'employer-ni-rise-calculator': [
    { question: `What does the Employer NI Rise Impact Calculator (April 2025) do?`,  answer: `Calculate the extra employer NI cost from the April 2025 rate rise (13.8% → 15%, threshold £9,100 → £5,000).` },
    { question: `Is this calculator updated for the 2026/27 tax year?`,  answer: `Yes. This calculator uses the latest HMRC rates and thresholds for the 2026/27 UK tax year, which runs from 6 April 2026 to 5 April 2026. Rates are verified against official HMRC publications.` },
    { question: `Do I need to tell HMRC about this?`,  answer: `Whether you need to report to HMRC depends on your individual circumstances. If you are unsure, check GOV.UK or contact HMRC directly. This calculator provides estimates for guidance only.` },
  ],
  'pay-per-mile-calculator': [
    { question: `What does the EV Pay-Per-Mile Road Pricing Calculator do?`,  answer: `Compare potential road pricing costs vs current VED and fuel duty. Prepare for future EV taxation.` },
    { question: `Does this use current UK rates?`,  answer: `Yes. This calculator uses the latest UK rates for vehicle tax, fuel duty and other motoring costs as of the 2026/27 financial year.` },
    { question: `Is this suitable for electric vehicles?`,  answer: `From April 2025, electric vehicles are no longer exempt from Vehicle Excise Duty (road tax). This calculator accounts for EV-specific rates where applicable.` },
  ],
  'high-council-tax-calculator': [
    { question: `What does the High-Value Property Council Tax Calculator (2028) do?`,  answer: `Estimate council tax with proposed surcharge for Band H+ properties. See all bands including new I and J.` },
    { question: `Is this calculator updated for the 2026/27 tax year?`,  answer: `Yes. This calculator uses the latest HMRC rates and thresholds for the 2026/27 UK tax year, which runs from 6 April 2026 to 5 April 2026. Rates are verified against official HMRC publications.` },
    { question: `Do I need to tell HMRC about this?`,  answer: `Whether you need to report to HMRC depends on your individual circumstances. If you are unsure, check GOV.UK or contact HMRC directly. This calculator provides estimates for guidance only.` },
  ],
  'sole-trader-vs-ltd-comparison-calculator': [
    { question: `What does the Sole Trader vs Ltd Comparison Table do?`,  answer: `Side-by-side take-home pay comparison at 7 different profit levels (£20K-£100K).` },
    { question: `Is this suitable for my business?`,  answer: `This calculator provides general estimates based on standard UK business rates and rules. Every business is different — consult your accountant for advice specific to your circumstances.` },
    { question: `Does this use 2026/27 tax rates?`,  answer: `Yes. All rates and thresholds are based on the current 2026/27 UK tax year. Corporation Tax main rate is 25% for profits over £250,000, with a 19% small profits rate.` },
  ],
  'apprenticeship-levy-calculator': [
    { question: `What does the Apprenticeship Levy Calculator do?`,  answer: `Calculate apprenticeship levy at 0.5% of pay bill over £3M. See government top-up and total training fund.` },
    { question: `Is this suitable for my business?`,  answer: `This calculator provides general estimates based on standard UK business rates and rules. Every business is different — consult your accountant for advice specific to your circumstances.` },
    { question: `Does this use 2026/27 tax rates?`,  answer: `Yes. All rates and thresholds are based on the current 2026/27 UK tax year. Corporation Tax main rate is 25% for profits over £250,000, with a 19% small profits rate.` },
  ],
  'shared-parental-pay-calculator': [
    { question: `What does the Shared Parental Pay (ShPP) Quick Calculator do?`,  answer: `Quick calculation of Shared Parental Pay at £194.32/week or 90% of salary.` },
    { question: `Is this calculator based on 2026/27 rates?`,  answer: `Yes. This calculator uses the current 2026/27 UK tax year rates for income tax, National Insurance and other deductions, effective from 6 April 2026.` },
    { question: `Does this include pension contributions?`,  answer: `This calculator can factor in workplace pension contributions. Under auto-enrolment, the minimum is 8% total (5% employee + 3% employer) of qualifying earnings.` },
  ],
  'home-buying-total-cost-calculator': [
    { question: `What does the Home Buying Total Cost Calculator do?`,  answer: `Calculate every cost of buying a home — deposit, stamp duty, solicitor, survey, searches, and monthly mortgage.` },
    { question: `Is this based on current interest rates?`,  answer: `You can enter any interest rate to model different scenarios. Check the Bank of England base rate and current mortgage deals from lenders for the latest rates.` },
    { question: `Should I get professional advice?`,  answer: `This calculator provides estimates for guidance only. For a formal mortgage offer, speak to a mortgage broker or lender who can assess your full circumstances and provide personalised advice.` },
  ],
  'council-tax-reduction-calculator': [
    { question: `What does the Council Tax Reduction Calculator do?`,  answer: `Check which council tax discounts and exemptions you qualify for — single person, student, disabled, care leaver.` },
    { question: `Is this calculator updated for the 2026/27 tax year?`,  answer: `Yes. This calculator uses the latest HMRC rates and thresholds for the 2026/27 UK tax year, which runs from 6 April 2026 to 5 April 2026. Rates are verified against official HMRC publications.` },
    { question: `Do I need to tell HMRC about this?`,  answer: `Whether you need to report to HMRC depends on your individual circumstances. If you are unsure, check GOV.UK or contact HMRC directly. This calculator provides estimates for guidance only.` },
  ],
  'student-budget-planner-calculator': [
    { question: `What does the Student Budget Planner do?`,  answer: `Plan your weekly student budget with income from loan, job and parents against term-time expenses.` },
    { question: `Is this based on current student finance rates?`,  answer: `Yes. This calculator uses Student Loans Company rates and thresholds for the 2026/27 academic and financial year. Thresholds and interest rates are updated annually.` },
    { question: `Which student loan plan am I on?`,  answer: `Plan 1 applies if you started before September 2012 (England/Wales) or are from Northern Ireland. Plan 2 applies from September 2012 in England/Wales. Plan 4 is for Scotland. Plan 5 applies from September 2023.` },
  ],
  'minimum-wage-calculator': [
    { question: `What does the Minimum Wage Calculator (NMW/NLW) do?`,  answer: `Calculate earnings at National Minimum/Living Wage rates by age group. Weekly, monthly and annual.` },
    { question: `Is this calculator based on 2026/27 rates?`,  answer: `Yes. This calculator uses the current 2026/27 UK tax year rates for income tax, National Insurance and other deductions, effective from 6 April 2026.` },
    { question: `Does this include pension contributions?`,  answer: `This calculator can factor in workplace pension contributions. Under auto-enrolment, the minimum is 8% total (5% employee + 3% employer) of qualifying earnings.` },
  ],
  'first-homes-scheme-calculator': [
    { question: `What does the First Homes Scheme Calculator do?`,  answer: `Calculate First Homes discounted price (30-50% off). Check if you can afford with income and deposit.` },
    { question: `Is this based on current interest rates?`,  answer: `You can enter any interest rate to model different scenarios. Check the Bank of England base rate and current mortgage deals from lenders for the latest rates.` },
    { question: `Should I get professional advice?`,  answer: `This calculator provides estimates for guidance only. For a formal mortgage offer, speak to a mortgage broker or lender who can assess your full circumstances and provide personalised advice.` },
  ],
  'shared-ownership-affordability-calculator': [
    { question: `What does the Shared Ownership Mortgage Affordability do?`,  answer: `Check if you can afford shared ownership — mortgage on your share plus rent on unsold share.` },
    { question: `Is this based on current interest rates?`,  answer: `You can enter any interest rate to model different scenarios. Check the Bank of England base rate and current mortgage deals from lenders for the latest rates.` },
    { question: `Should I get professional advice?`,  answer: `This calculator provides estimates for guidance only. For a formal mortgage offer, speak to a mortgage broker or lender who can assess your full circumstances and provide personalised advice.` },
  ],
  'invoice-profit-calculator': [
    { question: `What does the Invoice & Job Profit Calculator do?`,  answer: `Calculate profit margin and markup on jobs. Add VAT and generate invoice total.` },
    { question: `Is this suitable for my business?`,  answer: `This calculator provides general estimates based on standard UK business rates and rules. Every business is different — consult your accountant for advice specific to your circumstances.` },
    { question: `Does this use 2026/27 tax rates?`,  answer: `Yes. All rates and thresholds are based on the current 2026/27 UK tax year. Corporation Tax main rate is 25% for profits over £250,000, with a 19% small profits rate.` },
  ],
  'employee-vs-contractor-calculator': [
    { question: `What does the Employee vs Contractor Calculator do?`,  answer: `Compare take-home pay as an employee vs contractor for the same total cost to the hiring company.` },
    { question: `Is this suitable for my business?`,  answer: `This calculator provides general estimates based on standard UK business rates and rules. Every business is different — consult your accountant for advice specific to your circumstances.` },
    { question: `Does this use 2026/27 tax rates?`,  answer: `Yes. All rates and thresholds are based on the current 2026/27 UK tax year. Corporation Tax main rate is 25% for profits over £250,000, with a 19% small profits rate.` },
  ],
  'standing-charge-savings-calculator': [
    { question: `What does the Standing Charge Savings Calculator do?`,  answer: `Calculate how much you pay in standing charges alone. Compare zero standing charge tariffs.` },
    { question: `Does this reflect the current energy price cap?`,  answer: `This calculator uses representative energy prices. The Ofgem energy price cap changes quarterly — check Ofgem\'s website for the latest cap level applicable to your region and payment method.` },
    { question: `Can I save money by switching tariff?`,  answer: `Potentially yes. The energy market offers various fixed and variable tariffs. Use a comparison site authorised by Ofgem (such as Ofgem\'s own comparison tool) to check if switching could save you money.` },
  ],
  'gas-cost-calculator': [
    { question: `What does the Gas Cost Calculator do?`,  answer: `Calculate annual gas bill from kWh usage, unit rate and standing charge.` },
    { question: `Does this reflect the current energy price cap?`,  answer: `This calculator uses representative energy prices. The Ofgem energy price cap changes quarterly — check Ofgem\'s website for the latest cap level applicable to your region and payment method.` },
    { question: `Can I save money by switching tariff?`,  answer: `Potentially yes. The energy market offers various fixed and variable tariffs. Use a comparison site authorised by Ofgem (such as Ofgem\'s own comparison tool) to check if switching could save you money.` },
  ],
  'exponent-calculator': [
    { question: `What does the Exponent / Power Calculator do?`,  answer: `Calculate any number raised to any power. See common powers of your base number.` },
    { question: `How accurate are the results?`,  answer: `This calculator uses standard mathematical algorithms and provides results accurate to the precision shown. For very large numbers or high-precision requirements, results are rounded to a reasonable number of decimal places.` },
    { question: `Can I use this for schoolwork?`,  answer: `Yes. This calculator is suitable for GCSE, A-level and university-level mathematics. It follows standard mathematical conventions used in UK education.` },
  ],
  'logarithm-calculator': [
    { question: `What does the Logarithm Calculator do?`,  answer: `Calculate log₁₀, ln, log₂ and custom base logarithms. Includes antilog and log rules.` },
    { question: `How accurate are the results?`,  answer: `This calculator uses standard mathematical algorithms and provides results accurate to the precision shown. For very large numbers or high-precision requirements, results are rounded to a reasonable number of decimal places.` },
    { question: `Can I use this for schoolwork?`,  answer: `Yes. This calculator is suitable for GCSE, A-level and university-level mathematics. It follows standard mathematical conventions used in UK education.` },
  ],
  'employee-cost-breakdown-calculator': [
    { question: `What does the Employee Cost Breakdown Calculator do?`,  answer: `Calculate true cost of employment including NI, pension, training, equipment and recruitment.` },
    { question: `Is this suitable for my business?`,  answer: `This calculator provides general estimates based on standard UK business rates and rules. Every business is different — consult your accountant for advice specific to your circumstances.` },
    { question: `Does this use 2026/27 tax rates?`,  answer: `Yes. All rates and thresholds are based on the current 2026/27 UK tax year. Corporation Tax main rate is 25% for profits over £250,000, with a 19% small profits rate.` },
  ],
  'contractor-vs-perm-calculator': [
    { question: `What does the Contractor vs Permanent Salary Calculator do?`,  answer: `Compare contractor day rate vs permanent salary. See the premium needed to match perm benefits.` },
    { question: `Is this suitable for my business?`,  answer: `This calculator provides general estimates based on standard UK business rates and rules. Every business is different — consult your accountant for advice specific to your circumstances.` },
    { question: `Does this use 2026/27 tax rates?`,  answer: `Yes. All rates and thresholds are based on the current 2026/27 UK tax year. Corporation Tax main rate is 25% for profits over £250,000, with a 19% small profits rate.` },
  ],
  'postgraduate-loan-cost-calculator': [
    { question: `What does the Postgraduate Loan Total Cost Calculator do?`,  answer: `Calculate total postgraduate loan repayment over 30 years with salary growth projections.` },
    { question: `Is this based on current student finance rates?`,  answer: `Yes. This calculator uses Student Loans Company rates and thresholds for the 2026/27 academic and financial year. Thresholds and interest rates are updated annually.` },
    { question: `Which student loan plan am I on?`,  answer: `Plan 1 applies if you started before September 2012 (England/Wales) or are from Northern Ireland. Plan 2 applies from September 2012 in England/Wales. Plan 4 is for Scotland. Plan 5 applies from September 2023.` },
  ],
  'wedding-cost-calculator': [
    { question: `What does the Wedding Cost Calculator (Detailed) do?`,  answer: `Calculate detailed wedding costs across 17 categories with per-guest items. See cost per guest.` },
    { question: `Is this calculator free to use?`,  answer: `Yes. All calculators on Calks.uk are completely free to use. No account or registration is required. All calculations run in your browser — no data is collected.` },
    { question: `Can I use this on my phone?`,  answer: `Yes. All our calculators are fully responsive and work on smartphones, tablets and desktop computers. The interface adapts to your screen size automatically.` },
  ],
  'time-duration-calculator': [
    { question: `What does the Time Duration Calculator do?`,  answer: `Calculate hours and minutes between two times. Includes decimal hours for timesheets.` },
    { question: `Is this calculator free to use?`,  answer: `Yes. All calculators on Calks.uk are completely free to use. No account or registration is required. All calculations run in your browser — no data is collected.` },
    { question: `Can I use this on my phone?`,  answer: `Yes. All our calculators are fully responsive and work on smartphones, tablets and desktop computers. The interface adapts to your screen size automatically.` },
  ],
  'split-bill-calculator': [
    { question: `What does the Split Bill Calculator do?`,  answer: `Split a bill between multiple people with itemised costs. Add people and items dynamically.` },
    { question: `Is this calculator free to use?`,  answer: `Yes. All calculators on Calks.uk are completely free to use. No account or registration is required. All calculations run in your browser — no data is collected.` },
    { question: `Can I use this on my phone?`,  answer: `Yes. All our calculators are fully responsive and work on smartphones, tablets and desktop computers. The interface adapts to your screen size automatically.` },
  ],
  'speed-distance-time-calculator': [
    { question: `What does the Speed, Distance & Time Calculator do?`,  answer: `Calculate speed, distance or time from the other two. Miles and km with the SDT triangle formula.` },
    { question: `Is this calculator free to use?`,  answer: `Yes. All calculators on Calks.uk are completely free to use. No account or registration is required. All calculations run in your browser — no data is collected.` },
    { question: `Can I use this on my phone?`,  answer: `Yes. All our calculators are fully responsive and work on smartphones, tablets and desktop computers. The interface adapts to your screen size automatically.` },
  ],
  'profit-and-loss-calculator': [
    { question: `What does the Profit & Loss Calculator do?`,  answer: `Build a simple P&L statement. Enter revenue, COGS and overheads to see gross and net profit margins.` },
    { question: `Is this suitable for my business?`,  answer: `This calculator provides general estimates based on standard UK business rates and rules. Every business is different — consult your accountant for advice specific to your circumstances.` },
    { question: `Does this use 2026/27 tax rates?`,  answer: `Yes. All rates and thresholds are based on the current 2026/27 UK tax year. Corporation Tax main rate is 25% for profits over £250,000, with a 19% small profits rate.` },
  ],
  'freelance-quote-calculator': [
    { question: `What does the Freelance Quote Calculator do?`,  answer: `Build a quote from hourly rate, hours and materials. Add profit margin and VAT.` },
    { question: `Is this suitable for my business?`,  answer: `This calculator provides general estimates based on standard UK business rates and rules. Every business is different — consult your accountant for advice specific to your circumstances.` },
    { question: `Does this use 2026/27 tax rates?`,  answer: `Yes. All rates and thresholds are based on the current 2026/27 UK tax year. Corporation Tax main rate is 25% for profits over £250,000, with a 19% small profits rate.` },
  ],
  'tax-code-checker': [
    { question: `What does tax code 1257L mean?`,  answer: `Tax code 1257L is the most common UK tax code for 2026/27. The number 1257 means your tax-free Personal Allowance is £12,570 (1257 × 10). The letter L confirms you have the standard allowance with no additional adjustments.` },
    { question: `Why does my tax code start with K?`,  answer: `A K prefix means you have a negative allowance — untaxed income or benefits (such as a company car or state pension) exceed your Personal Allowance. HMRC adds tax to your employment income to collect what is owed. The K code amount is added to your gross pay before tax is calculated.` },
    { question: `What is an emergency tax code?`,  answer: `Emergency tax codes (1257L W1, 1257L M1, or 1257L X) mean your employer taxes each pay period in isolation rather than cumulatively. This often happens when starting a new job without a P45. Contact HMRC or your employer to correct it and receive a refund of overpaid tax.` },
    { question: `What does the S or C prefix on a tax code mean?`,  answer: `An S prefix means Scottish income tax rates apply to your employment income. A C prefix means Welsh rates apply. If you live in Scotland or Wales but do not have this prefix, contact HMRC to update your record.` },
  ],
  'car-depreciation-calculator': [
    { question: `How much does a new car depreciate in the first year?`,  answer: `New cars typically lose 15–25% of their value in the first year. After three years, most cars have lost 40–60% of their original value. Depreciation slows considerably in subsequent years as the steepest drop occurs early.` },
    { question: `Which cars depreciate the least in the UK?`,  answer: `Cars that hold their value best in the UK include popular mainstream models with strong demand and low running costs: Toyota RAV4, Volkswagen Golf GTI, Porsche 911, and most Volkswagen Group vehicles. Limited-edition models and German premium brands often retain value well.` },
    { question: `Do electric cars depreciate faster than petrol?`,  answer: `Currently, EVs depreciate faster than equivalent petrol cars in the UK, primarily due to rapid battery technology improvements making older models feel outdated, range anxiety concerns about ageing batteries, and a less established used market. This is expected to stabilise as EV adoption increases.` },
    { question: `How does depreciation affect car finance?`,  answer: `Depreciation is the largest cost of car ownership and is built into PCP (Personal Contract Purchase) finance. PCP monthly payments are based on the difference between the purchase price and the Guaranteed Minimum Future Value (GMFV) at the end of the term, plus interest. Understanding depreciation helps you negotiate better PCP terms.` },
  ],
  'mpg-calculator': [
    { question: `What is a good MPG for a UK car?`,  answer: `A petrol or diesel car achieving 40–50 MPG is considered efficient in the UK. Small city cars often achieve 50–60+ MPG. SUVs and larger cars typically return 30–40 MPG. Performance cars and large SUVs may achieve only 20–30 MPG. Hybrids typically achieve 50–70 MPG in mixed driving.` },
    { question: `How does MPG differ from L/100km?`,  answer: `MPG and L/100km measure fuel efficiency in opposite ways: MPG is miles per unit of fuel (higher is better), while L/100km is fuel per unit of distance (lower is better). To convert: L/100km = 282.48 ÷ MPG (UK). A 40 MPG car uses approximately 7.1 L/100km.` },
    { question: `Why is my real MPG lower than the official figure?`,  answer: `Official WLTP figures are tested in controlled laboratory conditions. Real-world MPG is lower due to factors including driving style, frequent short trips (cold engine is less efficient), motorway speeds, air conditioning use, roof boxes or cycle carriers, passenger weight, and tyre pressure. Expect 10–25% less than the official figure.` },
  ],
  'carer-allowance-calculator': [
    { question: "How much is Carer's Allowance in 2026/27?", answer: "Carer's Allowance is £81.90 per week (£4,258.80 per year) for 2026/27. It is taxable but does not affect means-tested benefits — instead it is taken into account as income in calculations for Universal Credit and other income-related benefits." },
    { question: "What is the earnings limit for Carer's Allowance?", answer: "Your net weekly earnings must not exceed £151 per week to receive Carer's Allowance. Net earnings are calculated after deducting income tax, National Insurance, pension contributions, and 50% of any pension premium costs. Self-employed carers use their weekly profit after allowable expenses." },
    { question: "Can I claim Carer's Allowance if I receive a State Pension?", answer: "If your State Pension is the same amount as or higher than Carer's Allowance (£81.90/week), you cannot receive both — only the higher of the two is paid. However, you can still be 'underlying entitled' to Carer's Allowance, which triggers the Carer Element in Universal Credit (£198.31/month in 2026/27)." },
  ],
  'employers-liability-calculator': [
    { question: "Is employers' liability insurance compulsory?", answer: "Yes. Under the Employers' Liability (Compulsory Insurance) Act 1969, virtually all UK businesses with at least one employee must hold EL insurance with a minimum cover of £5 million. Exemptions include family businesses where all employees are close family members, and certain public sector bodies. The fine for non-compliance is up to £2,500 per day." },
    { question: "What does employers' liability insurance cover?", answer: "EL insurance covers compensation claims from employees (or former employees) who suffer injury, illness or death as a result of their work. This includes injuries from accidents, occupational diseases like repetitive strain injury, asbestos-related illness, and hearing loss from noise exposure. It does not cover third-party claims from customers or members of the public — that requires separate public liability insurance." },
    { question: "How is the employers' liability premium calculated?", answer: "Premiums are typically expressed as a percentage of your annual wage bill, adjusted for your industry risk classification. A professional services firm might pay 0.3–0.8% of payroll, while a construction business might pay 1.5–3.0%. Your claims history and safety record also affect the rate significantly." },
  ],
  'blind-persons-allowance-calculator': [
    { question: "What is Blind Person's Allowance for 2026/27?", answer: "Blind Person's Allowance (BPA) for 2026/27 is £3,070. It is an additional income tax allowance added on top of your standard Personal Allowance of £12,570, giving a total tax-free income of £15,640. It is worth up to £614 per year in tax savings at the basic rate, or £1,228 at the higher rate." },
    { question: "Who qualifies for Blind Person's Allowance?", answer: "You qualify if you are registered as severely sight impaired (blind) with your local council. In England and Wales this requires a CVI (Certificate of Vision Impairment). In Scotland an SOAVI form is used. You can also claim if an ophthalmologist certifies you as unable to perform any work requiring eyesight, even before formal registration is complete." },
    { question: "Can I transfer Blind Person's Allowance to my spouse?", answer: "Yes. If you cannot use all of your Blind Person's Allowance because your income is too low, you can transfer the unused amount to your spouse or civil partner. They do not need to be registered blind. The transfer can save up to £614/year (basic rate) or £1,228/year (higher rate) depending on their tax band." },
  ],
  'teachers-pension-calculator': [
    { question: "How is the Teachers' Pension calculated?", answer: "Under the 2015 career average scheme, you earn 1/57th of your pensionable salary each year as a pension accrual. That amount is revalued annually by CPI + 1.6% until retirement. For example, a year on £40,000 adds £701.75/year to your pension (£40,000 ÷ 57), which then grows with inflation plus 1.6% every year." },
    { question: "What are the Teachers' Pension contribution rates for 2026/27?", answer: "Member contribution rates for 2026/27 are: 7.4% (up to £32,135), 8.6% (£32,136–£43,259), 9.7% (£43,260–£51,292), 10.2% (£51,293–£67,431), 11.7% (£67,432–£92,297) and 12.4% (above £92,297). Employer contributions are 23.68%. All contributions attract income tax relief." },
    { question: "When can I access my Teachers' Pension?", answer: "Normal Pension Age for the 2015 career average scheme is linked to State Pension Age (currently 67, rising to 68 from 2044). You can take your pension earlier with an actuarial reduction, or later with an enhancement. The pension is CPI-linked in payment." },
  ],
  'student-loan-total-cost-calculator': [
    { question: `Will I repay my student loan in full?`,  answer: `Most Plan 5 graduates (post-2023) will not repay their loan in full before the 40-year write-off. Plan 2 graduates (2012–2022) face a 30-year write-off. Whether you repay in full depends on your lifetime earnings. High earners repay everything plus interest; those on median earnings often have a substantial balance written off.` },
    { question: `How much interest is charged on a Plan 5 student loan?`,  answer: `Plan 5 loans accrue interest at the rate of RPI inflation only, regardless of your income. This is more favourable than Plan 2, which charged RPI + up to 3% on higher incomes. The RPI rate is set annually and published by the Student Loans Company.` },
    { question: `Is it worth making voluntary student loan overpayments?`,  answer: `For most Plan 2 and Plan 5 borrowers, voluntary overpayments are rarely financially beneficial unless you expect to repay the full balance before the write-off date. If you are unlikely to clear the full loan, any overpayment reduces the amount eventually written off rather than reducing your lifetime repayment. Run the full projection before making overpayments.` },
  ],
  'ni-salary-sacrifice-2029-calculator': [
    { question: `How does salary sacrifice save NI?`,  answer: `When you make pension contributions through salary sacrifice, your contractual salary is reduced by the contribution amount before NI is calculated. This lowers the NI base for both you and your employer. At the 2026/27 employer NI rate of 15%, every £1,000 directed to a pension saves the employer £150 in NI. Many employers share this saving with employees.` },
    { question: `What changes are proposed for salary sacrifice NI in 2029?`,  answer: `The government has consulted on restricting the employer NI advantage on pension contributions made via salary sacrifice. Under the proposed change, pension contributions would not reduce the employer NI base, removing the NI saving currently available. No legislation has been passed as of April 2026 and the 2029 date is subject to change.` },
    { question: `Should I increase salary sacrifice pension before 2029?`,  answer: `If the proposed changes proceed, maximising salary sacrifice pension contributions while the NI advantage remains available could be beneficial — particularly if your employer passes the NI saving back to you as an enhanced contribution. Review your pension arrangement with a financial adviser before making significant changes.` },
  ],
  'mortgage-early-repayment-calculator': [
    { question: `What is an Early Repayment Charge (ERC)?`,  answer: `Lenders charge an ERC if you overpay above your annual allowance (usually 10%) or fully repay during a fixed/discount period. ERC is typically a percentage of the amount repaid, tapering down each year: 5% in year 1, 4% year 2, 3% year 3, 2% year 4, 1% year 5 (typical 5-year fix). On a £200k mortgage with 3 years remaining at 3% ERC, full repayment costs £6,000. Always check your mortgage offer for exact ERC structure.` },
    { question: `When is paying the ERC worth it?`,  answer: `When your new rate would save more than the ERC over the remaining period. Example: £200k mortgage, current rate 6%, new rate available 4%, 18 months left on fix, ERC 3% (£6,000). 2% rate saving on £200k = £4,000/year × 1.5 years = £6,000 saved on rate alone, PLUS lower payments for the new 5-year deal beyond that. Use this calculator to compare. As a rule of thumb, switching with an ERC pays off if rates have moved 2%+ in your favour.` },
    { question: `Are there ways to avoid the ERC?`,  answer: `Some lenders offer 'porting' — keep your existing mortgage rate when moving home (no ERC). Most allow 10% annual overpayment without ERC. ERCs don't apply once you're on the SVR (Standard Variable Rate). 'Drop-lock' mortgages allow switching to a fixed rate mid-tracker without ERC. Bereavement or genuine financial hardship can sometimes waive ERCs — but lenders aren't obligated. Time your remortgage to land just after a fix expires for ERC-free switching.` },

  ],
  'care-cost-calculator': [
    { question: `What is the care home means-test threshold in England?`,  answer: `In England, if your total assessable assets exceed £23,250 (the upper capital limit), you are fully self-funded and must pay the full cost of your care. Below £14,250, the local authority meets most of the cost. Between the two limits, a sliding scale applies where you contribute £1 per week for every £250 of assets above £14,250.` },
    { question: `Is my home included in the care home means test?`,  answer: `Your home is included in the means test if it will be empty when you enter permanent residential care. However, it is disregarded if a spouse or civil partner, a dependent child under 18, or a qualifying carer lives there. Even if included, a Deferred Payment Agreement (DPA) with the council can allow you to delay selling until after death.` },
    { question: `What happened to the £86,000 care cost cap?`,  answer: `The Dilnot Commission proposed a lifetime care cap of £86,000, originally due to take effect in October 2023. This was delayed to October 2025 and has since been indefinitely postponed. As of April 2026, the existing means-test thresholds (£23,250 upper, £14,250 lower) remain in force with no cap in place.` },
  ],
}
