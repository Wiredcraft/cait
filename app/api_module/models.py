from sqlalchemy import ForeignKey

from app import db


class Company(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    revenue = db.Column(db.Float, nullable=False)
    country = db.Column(db.String(255), nullable=False)
    sector = db.Column(db.String(255), nullable=False)

    emission_reports = db.relationship('EmissionReport', backref='company', lazy='dynamic')
    reduction_targets = db.relationship('ReductionTarget', backref='company', lazy='dynamic')


class EmissionReport(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey('company.id'))
    year = db.Column(db.Integer, nullable=False)
    emissions = db.Column(db.Float, nullable=False)
    revenue = db.Column(db.Float, nullable=False)


class ReductionTarget(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey('company.id'))
    size = db.Column(db.Float, nullable=False)
    base_year = db.Column(db.Integer, nullable=False)
    final_year = db.Column(db.Integer, nullable=False)
    science_based_method = db.Column(db.String(255))

    milestones = db.relationship('Milestone', backref='reduction_target', lazy='dynamic')


class Milestone(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    reduction_target_id = db.Column(db.Integer, db.ForeignKey('reduction_target.id'))
    year = db.Column(db.Integer, nullable=False)
    size = db.Column(db.Float, nullable=False)
