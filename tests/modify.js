/// @ts-check

var assert = require("uvu/assert");
var test = require("uvu").test;
var CamlBuilder = require("../dist/camljs");
var vkbeautify = require("./vkbeautify");

test("ReplaceWhere", () => {
  var rawQuery =
    '<View Scope="RecursiveAll">\
            <Query>\
                <Where>\
                    <IsNotNull>\
                        <FieldRef Name="ID" />\
                    </IsNotNull>\
                </Where>\
            </Query>\
        </View>';

  var query = CamlBuilder.FromXml(rawQuery)
    .ReplaceWhere()
    .TextField("Title")
    .IsNotNull()
    .ToString();

  assert.equal(
    vkbeautify.xml(query),
    vkbeautify.xml(
      '<View Scope="RecursiveAll">\
            <Query>\
                <Where>\
                    <IsNotNull>\
                        <FieldRef Name="Title" />\
                    </IsNotNull>\
                </Where>\
            </Query>\
        </View>'
    )
  );
});

test("AppendToWhere", () => {
  var rawQuery =
    '<View Scope="RecursiveAll">\
            <Query>\
                <Where>\
                    <IsNotNull>\
                        <FieldRef Name="ID" />\
                    </IsNotNull>\
                </Where>\
            </Query>\
        </View>';

  var query = CamlBuilder.FromXml(rawQuery)
    .ModifyWhere()
    .AppendAnd()
    .TextField("Title")
    .IsNotNull()
    .ToString();

  assert.equal(
    vkbeautify.xml(query),
    vkbeautify.xml(
      '<View Scope="RecursiveAll">\
            <Query>\
                <Where>\
                    <And>\
                        <IsNotNull>\
                            <FieldRef Name="ID" />\
                        </IsNotNull>\
                        <IsNotNull>\
                            <FieldRef Name="Title" />\
                        </IsNotNull>\
                    </And>\
                </Where>\
            </Query>\
        </View>'
    )
  );
});

test("AppendToWhereWithOrderBy", () => {
  var rawQuery =
    '<View Scope="RecursiveAll">\
            <Query>\
                <Where>\
                    <Eq>\
                        <FieldRef Name="ID" />\
                        <Value Type="Number">10</Value>\
                    </Eq>\
                </Where>\
                <OrderBy>\
                    <FieldRef Name="Date" />\
                </OrderBy>\
            </Query>\
        </View>';

  var query = CamlBuilder.FromXml(rawQuery)
    .ModifyWhere()
    .AppendOr()
    .TextField("Title")
    .Contains("Summer")
    .ToString();

  assert.equal(
    vkbeautify.xml(query),
    vkbeautify.xml(
      '<View Scope="RecursiveAll">\
            <Query>\
                <OrderBy>\
                    <FieldRef Name="Date" />\
                </OrderBy>\
                <Where>\
                    <Or>\
                        <Eq>\
                            <FieldRef Name="ID" />\
                            <Value Type="Number">10</Value>\
                        </Eq>\
                        <Contains>\
                            <FieldRef Name="Title" />\
                            <Value Type="Text">Summer</Value>\
                        </Contains>\
                    </Or>\
                </Where>\
            </Query>\
        </View>'
    )
  );
});

test("OverrideQueryParams", () => {
  var rawQuery = '<Query><OrderBy><FieldRef Name="Title" /></OrderBy></Query>';

  var viewFields = [
    "FullName",
    "Salutations",
    "ContactType",
    "BusinessPhone",
    "EmailAddress",
  ];

  var query = CamlBuilder.FromXml(rawQuery)
    .OverrideQueryParams(100, true, viewFields)
    .ToString();

  assert.equal(
    vkbeautify.xml(query),
    vkbeautify.xml(
      '<View>\
        <ViewFields>\
            <FieldRef Name="FullName" />\
            <FieldRef Name="Salutations" />\
            <FieldRef Name="ContactType" />\
            <FieldRef Name="BusinessPhone" />\
            <FieldRef Name="EmailAddress" />\
        </ViewFields>\
        <RowLimit Paged="TRUE">100</RowLimit>\
        <Query>\
            <OrderBy>\
                <FieldRef Name="Title" />\
            </OrderBy>\
        </Query>\
      </View>'
    )
  );
});

test.run();
