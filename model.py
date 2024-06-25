from neomodel import (config, StructuredNode, StringProperty, IntegerProperty, RelationshipTo, RelationshipFrom, UniqueIdProperty)

#insert password
config.DATABASE_URL = 'bolt://developer:password@portal.chcdatabase.com:7687'

class Person(StructuredNode):
    uid = UniqueIdProperty()
    #id = StringProperty(unique_index=True, required=True)
    family_name_western = StringProperty()
    given_name_western = StringProperty()
    alternative_name_western = StringProperty()
    chinese_family_name_hanzi = StringProperty()
    chinese_given_name_hanzi = StringProperty()
    alternative_chinese_name_hanzi = StringProperty()
    chinese_family_name_romanized = StringProperty()
    chinese_given_name_romanized = StringProperty()
    alternative_chinese_name_romanized = StringProperty()
    birth_day = IntegerProperty()
    birth_month = IntegerProperty()
    birth_year = IntegerProperty()
    birth_place = StringProperty()
    death_day = IntegerProperty()
    death_month = IntegerProperty()
    death_year = IntegerProperty()
    death_place = StringProperty()
    burial_place = StringProperty()
    gender = StringProperty()
    nationality = StringProperty()
    embarkment = StringProperty()
    title = StringProperty()
    occupation = StringProperty()
    degree = StringProperty()
    christian_tradition = StringProperty()
    religious_family = StringProperty()
    baptism = StringProperty()
    confirmation = StringProperty()
    vestition = StringProperty()
    ordination_deacon = StringProperty()
    ordination_priest = StringProperty()
    ordination_bishop = StringProperty()
    ordination_archbishop = StringProperty()
    beatification = StringProperty()
    canonization = StringProperty()
    notes = StringProperty()
    source = StringProperty()
    involved_with_publication = RelationshipTo('Publication', 'INVOLVED_WITH')
    present_at_event = RelationshipTo('Event', 'PRESENT_AT')
    present_at_institution = RelationshipTo('Institution', 'PRESENT_AT')
    present_at_general_area = RelationshipTo('GeneralArea', 'PRESENT_AT')


class CorporateEntity(StructuredNode):
    uid = UniqueIdProperty()
    #id = StringProperty(unique_index=True, required=True)
    name_western = StringProperty(unique_index=True, required=True)
    alternative_name_western = StringProperty()
    chinese_name_hanzi = StringProperty()
    alternative_chinese_name_hanzi = StringProperty()
    name_romanized = StringProperty()
    alternative_name_romanized = StringProperty()
    abbreviation = StringProperty()
    other_abbreviation = StringProperty()
    corporate_entity_category = StringProperty()
    corporate_entity_subcategory = StringProperty()
    nationality = StringProperty()
    china_start = IntegerProperty()
    christian_tradition = StringProperty()
    religious_family = StringProperty()
    start_day = IntegerProperty()
    start_month = IntegerProperty()
    start_year = IntegerProperty()
    end_day = IntegerProperty()
    end_month = IntegerProperty()
    end_year = IntegerProperty()
    notes = StringProperty()
    source = StringProperty()


class Publication(StructuredNode):
    uid = UniqueIdProperty()
    #id = StringProperty(unique_index=True, required=True)
    name_western = StringProperty()
    alternative_name_western = StringProperty()
    chinese_name_hanzi = StringProperty()
    alternative_chinese_name_hanzi = StringProperty()
    chinese_name_romanized = StringProperty()
    alternative_chinese_name_romanized = StringProperty()
    edition = IntegerProperty()
    volume_number = IntegerProperty()
    issue_number = IntegerProperty()
    issue_frequency = StringProperty()
    circulation = StringProperty()
    format = StringProperty()
    price = StringProperty()
    publication_language = StringProperty()
    publication_category = StringProperty()
    publication_subcategory = StringProperty()
    start_day = IntegerProperty()
    start_month = IntegerProperty()
    start_year = IntegerProperty()
    end_day = IntegerProperty()
    end_month = IntegerProperty()
    end_year = IntegerProperty()
    notes = StringProperty()
    source = StringProperty()
    involved_with_corporate_entity = RelationshipTo('CorporateEntity', 'INVOLVED_WITH')


class Institution(StructuredNode):
    uid = UniqueIdProperty()
    #id = StringProperty(unique_index=True, required=True)
    name_western = StringProperty()
    alternative_name_western = StringProperty()
    chinese_name_hanzi = StringProperty()
    alternative_chinese_name_hanzi = StringProperty()
    name_romanized = StringProperty()
    alternative_name_romanized = StringProperty()
    institution_category = StringProperty()
    institution_subcategory = StringProperty()
    nationality = StringProperty()
    gender_served = StringProperty()
    christian_tradition = StringProperty()
    religious_family = StringProperty()
    start_day = IntegerProperty()
    start_month = IntegerProperty()
    start_year = IntegerProperty()
    end_day = IntegerProperty()
    end_month = IntegerProperty()
    end_year = IntegerProperty()
    notes = StringProperty()
    source = StringProperty()
    located_in = RelationshipFrom('Geography', 'LOCATED_IN')
    part_of = RelationshipFrom('CorporateEntity', 'PART_OF')

class Event(StructuredNode):
    uid = UniqueIdProperty()
    #id = StringProperty(unique_index=True, required=True)
    name_western = StringProperty()
    alternative_name_western = StringProperty()
    chinese_name_hanzi = StringProperty()
    alternative_chinese_name_hanzi = StringProperty()
    name_romanized = StringProperty()
    alternative_name_romanized = StringProperty()
    event_category = StringProperty()
    event_subcategory = StringProperty()
    christian_tradition = StringProperty()
    religious_family = StringProperty()
    start_day = IntegerProperty()
    start_month = IntegerProperty()
    start_year = IntegerProperty()
    end_day = IntegerProperty()
    end_month = IntegerProperty()
    end_year = IntegerProperty()
    notes = StringProperty()
    source = StringProperty()


class GeneralArea(StructuredNode):
    uid = UniqueIdProperty()
    #id = StringProperty(unique_index=True, required=True)
    name_western = StringProperty()
    alternative_name_western = StringProperty()


class Geography(StructuredNode):
    uid = UniqueIdProperty()
    #id = StringProperty(unique_index=True, required=True)
    name_wes = StringProperty(unique_index=True, required=True)
    name_zh = StringProperty()
    name_rom = StringProperty()
    latitude = IntegerProperty()
    longitude = IntegerProperty()
    inside_of = RelationshipTo('Geography','Inside Of')

class Nation(Geography):
    name_wes = StringProperty(required=True, unique_index = True)
class Province(Geography):
    name_wes = StringProperty(required=True, unique_index = True)
    inside_of = RelationshipTo('Nation', 'INSIDE_OF')
class Prefecture(Geography):
    name_wes = StringProperty(required=True, unique_index = True)
    inside_of = RelationshipTo('Province', 'INSIDE_OF')
class County(Geography):
    name_wes = StringProperty(required=True, unique_index = True)
    inside_of = RelationshipTo('Prefecture', 'INSIDE_OF')
class Township(Geography):
    name_wes = StringProperty(required=True, unique_index = True)
    inside_of = RelationshipTo('County', 'INSIDE_OF')
class Village(Geography):
    name_wes = StringProperty(required=True, unique_index = True)
    inside_of = RelationshipTo('Township', 'INSIDE_OF')

    
#QUERY 1
#NOTE: this query will not work unless Neo4j nodes use "uid" instead of "id." 
#"id" doesn't work for neomodel because it is used as a Neo4j internal. 
person = Person.nodes.get(uid="P_000284")
print(person)

#QUERY 2
german_people = Person.nodes.filter(nationality="Germany")
for person in german_people:
    print(person)

# QUERY 3
publications = Publication.nodes.filter(start_year__gt=1910)
for publication in publications:
    if publication.involved_with_corporate_entity.filter(name_western="Society of Jesus"):
        print(publication.name_western)
    
# QUERY 4
institutions = Institution.nodes.all()
for institution in institutions:
    if (institution.located_in.filter(name_wes__contains = "Beijing")) and (institution.part_of.filter(name_western__contains="Divine Word")):
        print(institution.name_western)








     


