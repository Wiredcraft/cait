from marshmallow import fields

from app import ma
from .models import Company, EmissionReport, ReductionTarget, Milestone


class CompanySchema(ma.ModelSchema):
    revenue = fields.Float()  # Prevent using Decimal for floats

    class Meta:
        model = Company


class EmissionReportSchema(ma.ModelSchema):
    emissions = fields.Float()
    revenue = fields.Float()

    class Meta:
        model = EmissionReport


class MilestoneSchema(ma.ModelSchema):
    size = fields.Float()

    class Meta:
        model = Milestone


class ReductionTargetSchema(ma.ModelSchema):
    emissions = fields.Float()
    revenue = fields.Float()
    milestones = fields.Nested(MilestoneSchema, many=True)

    class Meta:
        model = ReductionTarget


class CompanyDetailSchema(ma.ModelSchema):
    revenue = fields.Float()
    emission_reports = fields.Nested(EmissionReportSchema, many=True)
    reduction_targets = fields.Nested(ReductionTargetSchema, many=True)

    class Meta:
        model = Company
