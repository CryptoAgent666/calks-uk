import { lazy, Suspense } from 'react'

const calculators: Record<string, React.LazyExoticComponent<() => JSX.Element>> = {
  // Tax & HMRC
  'income-tax-calculator': lazy(() => import('./calculators/IncomeTaxCalculator')),
  'scottish-income-tax-calculator': lazy(() => import('./calculators/ScottishIncomeTaxCalculator')),
  'national-insurance-calculator': lazy(() => import('./calculators/NationalInsuranceCalculator')),
  'employer-ni-calculator': lazy(() => import('./calculators/EmployerNICalculator')),
  'vat-calculator': lazy(() => import('./calculators/VatCalculator')),
  'stamp-duty-calculator': lazy(() => import('./calculators/StampDutyCalculator')),
  'stamp-duty-first-time-buyer-calculator': lazy(() => import('./calculators/StampDutyFTBCalculator')),
  'self-assessment-tax-calculator': lazy(() => import('./calculators/SelfAssessmentCalculator')),
  'marriage-allowance-calculator': lazy(() => import('./calculators/MarriageAllowanceCalculator')),
  'capital-gains-tax-calculator': lazy(() => import('./calculators/CapitalGainsTaxCalculator')),
  'inheritance-tax-calculator': lazy(() => import('./calculators/InheritanceTaxCalculator')),
  'corporation-tax-calculator': lazy(() => import('./calculators/CorporationTaxCalculator')),
  'dividend-tax-calculator': lazy(() => import('./calculators/DividendTaxCalculator')),
  'council-tax-calculator': lazy(() => import('./calculators/CouncilTaxCalculator')),
  'company-car-tax-calculator': lazy(() => import('./calculators/CompanyCarTaxCalculator')),
  'crypto-tax-calculator': lazy(() => import('./calculators/CryptoTaxCalculator')),
  'vat-flat-rate-calculator': lazy(() => import('./calculators/VatFlatRateCalculator')),
  'lbtt-ltt-calculator': lazy(() => import('./calculators/LandTransactionTaxCalculator')),
  'landlord-tax-calculator': lazy(() => import('./calculators/LandlordTaxCalculator')),
  'tax-code-checker': lazy(() => import('./calculators/TaxCodeCheckerCalculator')),
  // Pay & Salary
  'take-home-pay-calculator': lazy(() => import('./calculators/TakeHomePayCalculator')),
  'holiday-entitlement-calculator': lazy(() => import('./calculators/HolidayEntitlementCalculator')),
  'redundancy-pay-calculator': lazy(() => import('./calculators/RedundancyPayCalculator')),
  'hourly-to-salary-calculator': lazy(() => import('./calculators/HourlyToSalaryCalculator')),
  'maternity-pay-calculator': lazy(() => import('./calculators/MaternityPayCalculator')),
  'employer-cost-calculator': lazy(() => import('./calculators/EmployerCostCalculator')),
  'bonus-tax-calculator': lazy(() => import('./calculators/BonusTaxCalculator')),
  'sick-pay-calculator': lazy(() => import('./calculators/SickPayCalculator')),
  'pay-rise-calculator': lazy(() => import('./calculators/PayRiseCalculator')),
  'paternity-pay-calculator': lazy(() => import('./calculators/PaternityPayCalculator')),
  'notice-period-calculator': lazy(() => import('./calculators/NoticeCalculator')),
  'work-from-home-tax-relief-calculator': lazy(() => import('./calculators/WorkFromHomeTaxReliefCalculator')),
  'overtime-calculator': lazy(() => import('./calculators/OvertimeCalculator')),
  'nhs-pay-calculator': lazy(() => import('./calculators/NhsPayCalculator')),
  // Mortgage & Property
  'mortgage-repayment-calculator': lazy(() => import('./calculators/MortgageRepaymentCalculator')),
  'mortgage-affordability-calculator': lazy(() => import('./calculators/MortgageAffordabilityCalculator')),
  'mortgage-overpayment-calculator': lazy(() => import('./calculators/MortgageOverpaymentCalculator')),
  'rental-yield-calculator': lazy(() => import('./calculators/RentalYieldCalculator')),
  'rent-vs-buy-calculator': lazy(() => import('./calculators/RentVsBuyCalculator')),
  'shared-ownership-calculator': lazy(() => import('./calculators/SharedOwnershipCalculator')),
  'equity-release-calculator': lazy(() => import('./calculators/EquityReleaseCalculator')),
  'moving-cost-calculator': lazy(() => import('./calculators/MovingCostCalculator')),
  // Pensions
  'pension-calculator': lazy(() => import('./calculators/WorkplacePensionCalculator')),
  'state-pension-calculator': lazy(() => import('./calculators/StatePensionCalculator')),
  'pension-tax-relief-calculator': lazy(() => import('./calculators/PensionTaxReliefCalculator')),
  'pension-drawdown-calculator': lazy(() => import('./calculators/PensionDrawdownCalculator')),
  'annuity-calculator': lazy(() => import('./calculators/AnnuityCalculator')),
  'pension-vs-isa-calculator': lazy(() => import('./calculators/PensionVsIsaCalculator')),
  // Savings & Investment
  'compound-interest-calculator': lazy(() => import('./calculators/CompoundInterestCalculator')),
  'isa-calculator': lazy(() => import('./calculators/IsaCalculator')),
  'savings-goal-calculator': lazy(() => import('./calculators/SavingsGoalCalculator')),
  'lifetime-isa-calculator': lazy(() => import('./calculators/LifetimeIsaCalculator')),
  'premium-bonds-calculator': lazy(() => import('./calculators/PremiumBondsCalculator')),
  // Loans & Debt
  'student-loan-repayment-calculator': lazy(() => import('./calculators/StudentLoanCalculator')),
  'personal-loan-calculator': lazy(() => import('./calculators/PersonalLoanCalculator')),
  'credit-card-repayment-calculator': lazy(() => import('./calculators/CreditCardRepaymentCalculator')),
  'overdraft-cost-calculator': lazy(() => import('./calculators/OverdraftCostCalculator')),
  'debt-free-calculator': lazy(() => import('./calculators/DebtFreeCalculator')),
  'car-finance-calculator': lazy(() => import('./calculators/CarFinanceCalculator')),
  // Business
  'sole-trader-tax-calculator': lazy(() => import('./calculators/SoleTraderTaxCalculator')),
  'ir35-calculator': lazy(() => import('./calculators/IR35Calculator')),
  'dividend-vs-salary-calculator': lazy(() => import('./calculators/DividendVsSalaryCalculator')),
  'salary-sacrifice-calculator': lazy(() => import('./calculators/SalarySacrificeCalculator')),
  'break-even-calculator': lazy(() => import('./calculators/BreakEvenCalculator')),
  'margin-calculator': lazy(() => import('./calculators/MarginCalculator')),
  'depreciation-calculator': lazy(() => import('./calculators/DepreciationCalculator')),
  'contractor-day-rate-calculator': lazy(() => import('./calculators/ContractorDayRateCalculator')),
  'vat-return-calculator': lazy(() => import('./calculators/VatReturnCalculator')),
  'payroll-calculator': lazy(() => import('./calculators/PayrollCalculator')),
  'late-payment-interest-calculator': lazy(() => import('./calculators/LatePenaltyCalculator')),
  // Auto
  'fuel-cost-calculator': lazy(() => import('./calculators/FuelCostCalculator')),
  'car-tax-calculator': lazy(() => import('./calculators/CarTaxCalculator')),
  'ev-charging-calculator': lazy(() => import('./calculators/EVChargingCalculator')),
  'commute-cost-calculator': lazy(() => import('./calculators/CommuteCostCalculator')),
  'speed-fine-calculator': lazy(() => import('./calculators/SpeedFineCalculator')),
  'mot-date-calculator': lazy(() => import('./calculators/MOTDateCalculator')),
  'train-season-ticket-calculator': lazy(() => import('./calculators/TrainSeasonTicketCalculator')),
  'car-depreciation-calculator': lazy(() => import('./calculators/CarDepreciationCalculator')),
  'driving-test-cost-calculator': lazy(() => import('./calculators/DrivingTestCostCalculator')),
  'mpg-calculator': lazy(() => import('./calculators/MilesPerGallonCalculator')),
  // Education
  'ucas-points-calculator': lazy(() => import('./calculators/UcasPointsCalculator')),
  'student-budget-calculator': lazy(() => import('./calculators/StudentBudgetCalculator')),
  'gcse-grade-calculator': lazy(() => import('./calculators/GCSEGradeCalculator')),
  'university-cost-calculator': lazy(() => import('./calculators/UniversityCostCalculator')),
  // Pay (additional)
  'mileage-allowance-calculator': lazy(() => import('./calculators/MileageAllowanceCalculator')),
  // Benefits
  'child-benefit-calculator': lazy(() => import('./calculators/ChildBenefitCalculator')),
  'universal-credit-calculator': lazy(() => import('./calculators/UniversalCreditCalculator')),
  'child-maintenance-calculator': lazy(() => import('./calculators/ChildMaintenanceCalculator')),
  'childcare-cost-calculator': lazy(() => import('./calculators/ChildcareCostCalculator')),
  // Health
  'bmi-calculator': lazy(() => import('./calculators/BmiCalculator')),
  'calorie-calculator': lazy(() => import('./calculators/CalorieCalculator')),
  'body-fat-calculator': lazy(() => import('./calculators/BodyFatCalculator')),
  'pregnancy-due-date-calculator': lazy(() => import('./calculators/PregnancyDueDateCalculator')),
  'alcohol-units-calculator': lazy(() => import('./calculators/AlcoholUnitsCalculator')),
  'sleep-calculator': lazy(() => import('./calculators/SleepCalculator')),
  'pace-calculator': lazy(() => import('./calculators/PaceCalculator')),
  'water-intake-calculator': lazy(() => import('./calculators/WaterIntakeCalculator')),
  // Construction
  'concrete-calculator': lazy(() => import('./calculators/ConcreteCalculator')),
  'paint-calculator': lazy(() => import('./calculators/PaintCalculator')),
  'flooring-calculator': lazy(() => import('./calculators/FlooringCalculator')),
  'tile-calculator': lazy(() => import('./calculators/TileCalculator')),
  'gravel-calculator': lazy(() => import('./calculators/GravelCalculator')),
  'wallpaper-calculator': lazy(() => import('./calculators/WallpaperCalculator')),
  'decking-calculator': lazy(() => import('./calculators/DeckingCalculator')),
  'fencing-calculator': lazy(() => import('./calculators/FencingCalculator')),
  'radiator-btu-calculator': lazy(() => import('./calculators/RadiatorBTUCalculator')),
  'bricks-calculator': lazy(() => import('./calculators/BricksCalculator')),
  'insulation-calculator': lazy(() => import('./calculators/InsulationCalculator')),
  // Tools
  'percentage-calculator': lazy(() => import('./calculators/PercentageCalculator')),
  'age-calculator': lazy(() => import('./calculators/AgeCalculator')),
  'currency-converter': lazy(() => import('./calculators/CurrencyConverter')),
  'discount-calculator': lazy(() => import('./calculators/DiscountCalculator')),
  'tip-calculator': lazy(() => import('./calculators/TipCalculator')),
  'date-calculator': lazy(() => import('./calculators/DateCalculator')),
  'weight-converter': lazy(() => import('./calculators/UnitConverterWeight')),
  'inflation-calculator': lazy(() => import('./calculators/InflationCalculator')),
  'wedding-budget-calculator': lazy(() => import('./calculators/WeddingBudgetCalculator')),
  'number-to-words-calculator': lazy(() => import('./calculators/NumberToWordsCalculator')),
  'random-number-generator': lazy(() => import('./calculators/RandomNumberGenerator')),
  'shoe-size-converter': lazy(() => import('./calculators/ShoeSizeConverter')),
  'ratio-calculator': lazy(() => import('./calculators/RatioCalculator')),
  // Energy
  'energy-bill-calculator': lazy(() => import('./calculators/EnergyBillCalculator')),
  'solar-panel-calculator': lazy(() => import('./calculators/SolarPanelCalculator')),
  'heat-pump-calculator': lazy(() => import('./calculators/HeatPumpCalculator')),
  'electricity-cost-calculator': lazy(() => import('./calculators/ElectricityCostCalculator')),
  'led-savings-calculator': lazy(() => import('./calculators/LedSavingsCalculator')),
  // Immigration
  'visa-points-calculator': lazy(() => import('./calculators/VisaPointsCalculator')),
  // Legal
  'court-fee-calculator': lazy(() => import('./calculators/CourtFeeCalculator')),
  'probate-fee-calculator': lazy(() => import('./calculators/ProbateFeeCalculator')),
  'spousal-maintenance-calculator': lazy(() => import('./calculators/SpousalMaintenanceCalculator')),
  // Insurance
  'life-insurance-calculator': lazy(() => import('./calculators/LifeInsuranceCalculator')),
  'income-protection-calculator': lazy(() => import('./calculators/IncomeProtectionCalculator')),
  'travel-insurance-calculator': lazy(() => import('./calculators/TravelInsuranceCalculator')),
  // Math
  'square-root-calculator': lazy(() => import('./calculators/SqrtCalculator')),
  'fraction-calculator': lazy(() => import('./calculators/FractionCalculator')),
  'standard-deviation-calculator': lazy(() => import('./calculators/StdDevCalculator')),
  'binary-converter': lazy(() => import('./calculators/BinaryConverter')),
  // Gardening
  'lawn-seed-calculator': lazy(() => import('./calculators/LawnSeedCalculator')),
  'topsoil-calculator': lazy(() => import('./calculators/TopsoilCalculator')),
  'paving-calculator': lazy(() => import('./calculators/PavingCalculator')),
  'mulch-calculator': lazy(() => import('./calculators/MulchCalculator')),
  'greenhouse-size-calculator': lazy(() => import('./calculators/GreenhouseSizeCalculator')),
  // Health (extra)
  'ideal-weight-calculator': lazy(() => import('./calculators/IdealWeightCalculator')),
  // Farming
  'fertiliser-calculator': lazy(() => import('./calculators/FertiliserCalculator')),
  'crop-yield-calculator': lazy(() => import('./calculators/CropYieldCalculator')),
  // Immigration (extra)
  'visa-fee-calculator': lazy(() => import('./calculators/VisaFeeCalculator')),
  // Extra batch
  'side-hustle-tax-calculator': lazy(() => import('./calculators/SideHustleTaxCalculator')),
  'employment-tribunal-calculator': lazy(() => import('./calculators/EmploymentTribunalCalculator')),
  'roof-tiles-calculator': lazy(() => import('./calculators/RoofTilesCalculator')),
  'water-bill-calculator': lazy(() => import('./calculators/WaterBillCalculator')),
  'pond-volume-calculator': lazy(() => import('./calculators/PondVolumeCalculator')),
  // Mortgage extra
  'buy-to-let-yield-calculator': lazy(() => import('./calculators/BuyToLetYieldCalculator')),
  'ltv-calculator': lazy(() => import('./calculators/LTVCalculator')),
  'stamp-duty-additional-property-calculator': lazy(() => import('./calculators/StampDutyAdditionalCalculator')),
  'remortgage-calculator': lazy(() => import('./calculators/RemortgageCalculator')),
  'debt-to-income-calculator': lazy(() => import('./calculators/DebtToIncomeCalculator')),
  // Loans extra
  'apr-calculator': lazy(() => import('./calculators/APRCalculator')),
  'bnpl-calculator': lazy(() => import('./calculators/BNPLCalculator')),
  // Pension extra
  'salary-sacrifice-pension-calculator': lazy(() => import('./calculators/SalaryPensionCalculator')),
  // Tools extra
  'temperature-converter': lazy(() => import('./calculators/TemperatureConverter')),
  'length-converter': lazy(() => import('./calculators/LengthConverter')),
  'area-converter': lazy(() => import('./calculators/AreaConverter')),
  'cooking-converter': lazy(() => import('./calculators/CookingConverter')),
  'timezone-converter': lazy(() => import('./calculators/TimezoneConverter')),
  // Immigration extra
  'ilr-calculator': lazy(() => import('./calculators/ILRCalculator')),
  // Health extra
  'steps-to-miles-calculator': lazy(() => import('./calculators/StepsToMilesCalculator')),
  'heart-rate-zone-calculator': lazy(() => import('./calculators/HeartRateZoneCalculator')),
  // Math extra
  'probability-calculator': lazy(() => import('./calculators/ProbabilityCalculator')),
  // Tax extra
  'annual-tax-summary-calculator': lazy(() => import('./calculators/AnnualTaxSummaryCalculator')),
  // Business extra
  'business-rates-calculator': lazy(() => import('./calculators/BusinessRatesCalculator')),
  'rd-tax-credit-calculator': lazy(() => import('./calculators/RDTaxCreditCalculator')),
  'cis-calculator': lazy(() => import('./calculators/CISCalculator')),
  // Insurance extra
  'pet-insurance-calculator': lazy(() => import('./calculators/PetInsuranceCalculator')),
  // Education extra
  'student-maintenance-loan-calculator': lazy(() => import('./calculators/StudentMaintenanceLoanCalculator')),
  // Energy extra
  'boiler-replacement-calculator': lazy(() => import('./calculators/BoilerReplacementCalculator')),
  'double-glazing-calculator': lazy(() => import('./calculators/DoubleGlazingCalculator')),
  // Health extra
  'weight-loss-calculator': lazy(() => import('./calculators/WeightLossCalculator')),
  'protein-intake-calculator': lazy(() => import('./calculators/ProteinIntakeCalculator')),
  'ovulation-calculator': lazy(() => import('./calculators/OvulationCalculator')),
  // Auto extra
  'car-lease-vs-buy-calculator': lazy(() => import('./calculators/CarLeaseVsBuyCalculator')),
  // Business extra
  'sole-trader-vs-ltd-calculator': lazy(() => import('./calculators/SoleTraderVsLtdCalculator')),
  // Benefits extra
  'carer-allowance-calculator': lazy(() => import('./calculators/CarerAllowanceCalculator')),
  'pension-credit-calculator': lazy(() => import('./calculators/PensionCreditCalculator')),
  'housing-benefit-calculator': lazy(() => import('./calculators/HousingBenefitCalculator')),
  // Business extra
  'vat-threshold-calculator': lazy(() => import('./calculators/VATThresholdCalculator')),
  'umbrella-company-calculator': lazy(() => import('./calculators/UmbrellaCompanyCalculator')),
  // Construction extra
  'plaster-calculator': lazy(() => import('./calculators/PlasterCalculator')),
  'staircase-calculator': lazy(() => import('./calculators/StaircaseCalculator')),
  // Education extra
  'exam-score-calculator': lazy(() => import('./calculators/ExamScoreCalculator')),
  // Math extra
  'roman-numeral-converter': lazy(() => import('./calculators/RomanNumeralConverter')),
  // Business extra
  'capital-allowances-calculator': lazy(() => import('./calculators/CapitalAllowancesCalculator')),
  'cash-flow-calculator': lazy(() => import('./calculators/CashFlowCalculator')),
  // Immigration extra
  'spouse-visa-calculator': lazy(() => import('./calculators/SpouseVisaCalculator')),
  // Farming extra
  'farm-operating-cost-calculator': lazy(() => import('./calculators/FarmOperatingCostCalculator')),
  // Legal extra
  'personal-injury-calculator': lazy(() => import('./calculators/PersonalInjuryCalculator')),
  // Investment extra
  'investment-return-calculator': lazy(() => import('./calculators/InvestmentReturnCalculator')),
  'savings-interest-tax-calculator': lazy(() => import('./calculators/SavingsInterestTaxCalculator')),
  'real-return-calculator': lazy(() => import('./calculators/RealReturnCalculator')),
  'rule-of-72-calculator': lazy(() => import('./calculators/Rule72Calculator')),
  'cost-of-delay-calculator': lazy(() => import('./calculators/CostOfDelayCalculator')),
  // Pay extra
  'teacher-pay-calculator': lazy(() => import('./calculators/TeacherPayCalculator')),
  'shared-parental-leave-calculator': lazy(() => import('./calculators/SharedParentalLeaveCalculator')),
  // Benefits extra
  'high-income-child-benefit-calculator': lazy(() => import('./calculators/HighIncomeChildBenefitCalculator')),
  'benefit-cap-calculator': lazy(() => import('./calculators/BenefitCapCalculator')),
  // Math extra
  'trigonometry-calculator': lazy(() => import('./calculators/TrigCalculator')),
  // Pay extra
  'freelance-tax-calculator': lazy(() => import('./calculators/FreelanceTaxCalculator')),
  // Health extra
  'macro-calculator': lazy(() => import('./calculators/MacroCalculator')),
  // Tools extra
  'cost-of-living-calculator': lazy(() => import('./calculators/CostOfLivingCalculator')),
  // Energy
  'smart-meter-calculator': lazy(() => import('./calculators/SmartMeterCalculator')),
  // Education
  'gpa-calculator': lazy(() => import('./calculators/GPACalculator')),
  // Legal
  'solicitor-fee-calculator': lazy(() => import('./calculators/SolicitorFeeCalculator')),
  'divorce-settlement-calculator': lazy(() => import('./calculators/DivorceSettlementCalculator')),
  // Immigration
  'uk-citizenship-calculator': lazy(() => import('./calculators/UKCitizenshipCalculator')),
  // Benefits
  'free-school-meals-calculator': lazy(() => import('./calculators/FreeschoolMealsCalculator')),
  // Construction
  'loft-conversion-calculator': lazy(() => import('./calculators/LoftConversionCalculator')),
  'extension-cost-calculator': lazy(() => import('./calculators/ExtensionCostCalculator')),
  // Benefits
  'childcare-entitlement-calculator': lazy(() => import('./calculators/ChildcareEntitlementCalculator')),
  // Farming
  'stock-unit-calculator': lazy(() => import('./calculators/StockUnitCalculator')),
  'agricultural-worker-wage-calculator': lazy(() => import('./calculators/AgricultureWorkerWageCalculator')),
  // Math
  'mean-median-mode-calculator': lazy(() => import('./calculators/MeanMedianModeCalculator')),
  'prime-number-calculator': lazy(() => import('./calculators/PrimeNumberCalculator')),
  // Health
  'waist-hip-ratio-calculator': lazy(() => import('./calculators/WaistHipRatioCalculator')),
  // Gardening
  'raised-bed-calculator': lazy(() => import('./calculators/RaisedBedCalculator')),
  'fence-paint-calculator': lazy(() => import('./calculators/FencePaintCalculator')),
  // Tools
  'clothing-size-converter': lazy(() => import('./calculators/ClothingSizeConverter')),
  'volume-converter': lazy(() => import('./calculators/VolumeConverter')),
  'birthday-calculator': lazy(() => import('./calculators/BirthdayCalculator')),
  // Insurance
  'employers-liability-calculator': lazy(() => import('./calculators/EmployersLiabilityCalculator')),
  'car-insurance-estimate-calculator': lazy(() => import('./calculators/CarInsuranceEstimateCalculator')),
  'home-insurance-calculator': lazy(() => import('./calculators/HomeInsuranceCalculator')),
  'critical-illness-calculator': lazy(() => import('./calculators/CriticalIllnessCalculator')),
  // Auto
  'ev-savings-calculator': lazy(() => import('./calculators/EVSavingsCalculator')),
  // Tax
  'blind-persons-allowance-calculator': lazy(() => import('./calculators/BlindPersonsAllowanceCalculator')),
  'property-cgt-calculator': lazy(() => import('./calculators/PropertyCGTCalculator')),
  // Education
  'weighted-grade-calculator': lazy(() => import('./calculators/WeightedGradeCalculator')),
  // Immigration
  'cost-of-living-comparison-calculator': lazy(() => import('./calculators/CostOfLivingComparisonCalculator')),
  // Pension
  'pension-annual-allowance-calculator': lazy(() => import('./calculators/PensionAnnualAllowanceCalculator')),
  'state-pension-age-calculator': lazy(() => import('./calculators/StatePensionAgeCalculator')),
  // Loans
  'student-loan-early-repay-calculator': lazy(() => import('./calculators/StudentLoanEarlyRepayCalculator')),
  // Pension
  'pension-pot-calculator': lazy(() => import('./calculators/PensionPotCalculator')),
  'teachers-pension-calculator': lazy(() => import('./calculators/TeachersPensionCalculator')),
  // Investment
  'junior-isa-calculator': lazy(() => import('./calculators/JuniorIsaCalculator')),
  // Pay
  'zero-hours-calculator': lazy(() => import('./calculators/ZeroHoursCalculator')),
  'agency-worker-calculator': lazy(() => import('./calculators/AgencyWorkerCalculator')),
  'settlement-agreement-calculator': lazy(() => import('./calculators/SettlementAgreementCalculator')),
  // Mortgage
  'buy-to-let-mortgage-calculator': lazy(() => import('./calculators/BuyToLetMortgageCalculator')),
  'house-price-sqft-calculator': lazy(() => import('./calculators/HousePriceSqFtCalculator')),
  'lease-extension-calculator': lazy(() => import('./calculators/LeaseExtensionCalculator')),
  // Loans
  'student-loan-interest-calculator': lazy(() => import('./calculators/StudentLoanInterestCalculator')),
  'debt-consolidation-calculator': lazy(() => import('./calculators/DebtConsolidationCalculator')),
  'postgraduate-loan-calculator': lazy(() => import('./calculators/PostgraduateLoanCalculator')),
  // Energy
  'epc-calculator': lazy(() => import('./calculators/EPCCalculator')),
  // Construction
  'bathroom-cost-calculator': lazy(() => import('./calculators/BathroomCostCalculator')),
  'kitchen-cost-calculator': lazy(() => import('./calculators/KitchenCostCalculator')),
  'timber-calculator': lazy(() => import('./calculators/TimberCalculator')),
  'underfloor-heating-calculator': lazy(() => import('./calculators/UnderfloorHeatingCalculator')),
  // Education
  'student-allowance-calculator': lazy(() => import('./calculators/StudentAllowanceCalculator')),
  // Pay
  'night-shift-calculator': lazy(() => import('./calculators/NightShiftCalculator')),
  'benefits-in-kind-calculator': lazy(() => import('./calculators/BenefitsInKindCalculator')),
  // Investment
  'regular-savings-calculator': lazy(() => import('./calculators/RegularSavingsCalculator')),
  // Pay
  'business-mileage-calculator': lazy(() => import('./calculators/MileageCalculator')),
  // Investment
  'wealth-growth-calculator': lazy(() => import('./calculators/WealthGrowthCalculator')),
  'cgt-on-shares-calculator': lazy(() => import('./calculators/CGTOnSharesCalculator')),
  'dividend-income-calculator': lazy(() => import('./calculators/DividendIncomeCalculator')),
  // Tax
  'non-dom-tax-calculator': lazy(() => import('./calculators/NonDomTaxCalculator')),
  // Business
  'annual-investment-allowance-calculator': lazy(() => import('./calculators/AnnualInvestmentAllowanceCalculator')),
  // Mortgage
  'mortgage-interest-rate-calculator': lazy(() => import('./calculators/MortgageInterestRateCalculator')),
  'first-home-buyer-calculator': lazy(() => import('./calculators/FirstHomeBuyerCalculator')),
  // Pension
  'sipp-calculator': lazy(() => import('./calculators/SIPPCalculator')),
  // Benefits
  'tax-credits-calculator': lazy(() => import('./calculators/TaxWorkingCreditsCalculator')),
  // Investment
  'stocks-shares-isa-calculator': lazy(() => import('./calculators/StocksSharesIsaCalculator')),
  // Energy
  'epc-rating-comparison-calculator': lazy(() => import('./calculators/EPCRatingCalculator')),
  // Investment
  'help-to-save-calculator': lazy(() => import('./calculators/HelpToSaveCalculator')),
  'ns-i-savings-calculator': lazy(() => import('./calculators/SavingsInterestCalculator')),
  // Health
  'bmi-children-calculator': lazy(() => import('./calculators/NICEFIQCalculator')),
  // Mortgage
  'offset-mortgage-calculator': lazy(() => import('./calculators/OffsetMortgageCalculator')),
  'ground-rent-calculator': lazy(() => import('./calculators/GroundRentCalculator')),
  'service-charge-calculator': lazy(() => import('./calculators/ServiceChargeCalculator')),
  // Pension
  'pension-consolidation-calculator': lazy(() => import('./calculators/PensionConsolidationCalculator')),
  'employer-pension-contribution-calculator': lazy(() => import('./calculators/EmployerPensionCalculator')),
  // Mortgage
  'right-to-buy-calculator': lazy(() => import('./calculators/RightToBuyCalculator')),
  'staircasing-calculator': lazy(() => import('./calculators/SharedOwnershipStaircasingCalculator')),
  // Pension
  'pension-lump-sum-calculator': lazy(() => import('./calculators/PensionLumpSumCalculator')),
  // Farming
  'elm-payment-calculator': lazy(() => import('./calculators/ELMPaymentCalculator')),
  'farm-tenancy-calculator': lazy(() => import('./calculators/FarmTenancyCalculator')),
  // Education
  'student-loan-total-cost-calculator': lazy(() => import('./calculators/StudentLoanTotalCostCalculator')),
  // Pay
  'ev-salary-sacrifice-calculator': lazy(() => import('./calculators/EVSalarySacrificeCalculator')),
  // Auto
  'ulez-calculator': lazy(() => import('./calculators/ULEZCalculator')),
  'car-import-duty-calculator': lazy(() => import('./calculators/CarImportDutyCalculator')),
  'road-trip-cost-calculator': lazy(() => import('./calculators/RoadTripCostCalculator')),
  // Tax
  'making-tax-digital-calculator': lazy(() => import('./calculators/MakingTaxDigitalCalculator')),
  'tax-bracket-visualizer': lazy(() => import('./calculators/TaxBracketVisualizerCalculator')),
  // Business
  'business-mileage-record-calculator': lazy(() => import('./calculators/BusinessMileageRecordCalculator')),
  // Pension
  'pension-sharing-divorce-calculator': lazy(() => import('./calculators/PensionSharingDivorceCalculator')),
  // Benefits
  'working-hours-benefits-calculator': lazy(() => import('./calculators/WorkingTaxCreditHoursCalculator')),
  // Tax
  'inheritance-tax-pension-calculator': lazy(() => import('./calculators/InheritanceTaxPensionCalculator')),
  // Business
  'mtd-readiness-calculator': lazy(() => import('./calculators/MTDReadinessCalculator')),
  // Auto
  'congestion-charge-calculator': lazy(() => import('./calculators/CongestionChargeCalculator')),
  // Education
  'a-level-grade-calculator': lazy(() => import('./calculators/ALevelGradeCalculator')),
  // Loans
  'student-loan-plan4-calculator': lazy(() => import('./calculators/PostgraduateLoanRepaymentCalculator')),
  // Tax (trending)
  'crypto-carf-calculator': lazy(() => import('./calculators/CryptoTaxCARFCalculator')),
  'employer-ni-rise-calculator': lazy(() => import('./calculators/EmployerNIRiseCalculator')),
  // Auto (trending)
  'pay-per-mile-calculator': lazy(() => import('./calculators/PayPerMileCalculator')),
  // Tax (trending)
  'high-council-tax-calculator': lazy(() => import('./calculators/HighCouncilTaxCalculator')),
  'ni-salary-sacrifice-2029-calculator': lazy(() => import('./calculators/NISalarySacrificeCalculator')),
  // Business
  'sole-trader-vs-ltd-comparison-calculator': lazy(() => import('./calculators/SoleTraderVsLtdComparisonCalculator')),
  'apprenticeship-levy-calculator': lazy(() => import('./calculators/ApprenticeshipLevyCalculator')),
  // Mortgage
  'mortgage-early-repayment-calculator': lazy(() => import('./calculators/MortgageEarlyRepaymentCalculator')),
  // Pay
  'shared-parental-pay-calculator': lazy(() => import('./calculators/SharedParentalPayCalculator')),
  // Mortgage
  'home-buying-total-cost-calculator': lazy(() => import('./calculators/HomeBuyingTotalCostCalculator')),
  // Tax
  'council-tax-reduction-calculator': lazy(() => import('./calculators/CouncilTaxReductionCalculator')),
  // Education
  'student-budget-planner-calculator': lazy(() => import('./calculators/StudentBudgetPlannerCalculator')),
  // Benefits
  'care-cost-calculator': lazy(() => import('./calculators/CareCostCalculator')),
  // Pay
  'minimum-wage-calculator': lazy(() => import('./calculators/MinimumWageCalculator')),
  // Mortgage
  'first-homes-scheme-calculator': lazy(() => import('./calculators/FirstHomesSchemeCalculator')),
  'shared-ownership-affordability-calculator': lazy(() => import('./calculators/SharedOwnershipMortgageAffordabilityCalculator')),
  // Business
  'invoice-profit-calculator': lazy(() => import('./calculators/InvoiceProfitCalculator')),
  'employee-vs-contractor-calculator': lazy(() => import('./calculators/EmployeeVsContractorCalculator')),
  // Energy
  'standing-charge-savings-calculator': lazy(() => import('./calculators/StandingChargeSavingsCalculator')),
  'gas-cost-calculator': lazy(() => import('./calculators/GasCostCalculator')),
  // Math
  'exponent-calculator': lazy(() => import('./calculators/ExponentialCalculator')),
  'logarithm-calculator': lazy(() => import('./calculators/LogarithmCalculator')),
  // Business
  'employee-cost-breakdown-calculator': lazy(() => import('./calculators/EmployeeCostBreakdownCalculator')),
  'contractor-vs-perm-calculator': lazy(() => import('./calculators/ContractorVsPermCalculator')),
  // Education
  'postgraduate-loan-cost-calculator': lazy(() => import('./calculators/PostgraduateLoanCostCalculator')),
  // Tools
  'wedding-cost-calculator': lazy(() => import('./calculators/WeddingCostCalculator')),
  'time-duration-calculator': lazy(() => import('./calculators/TimeDurationCalculator')),
  'split-bill-calculator': lazy(() => import('./calculators/SplitBillCalculator')),
  'speed-distance-time-calculator': lazy(() => import('./calculators/SpeedDistanceTimeCalculator')),
  // Business
  'profit-and-loss-calculator': lazy(() => import('./calculators/ProfitAndLossCalculator')),
  'freelance-quote-calculator': lazy(() => import('./calculators/FreelanceQuoteCalculator')),
}

export default function CalculatorRenderer({ slug }: { slug: string }) {
  const Component = calculators[slug]

  if (!Component) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg font-medium">Calculator coming soon</p>
        <p className="mt-1 text-sm">This calculator is currently under development.</p>
      </div>
    )
  }

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    }>
      <Component />
    </Suspense>
  )
}
