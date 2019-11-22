<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:html="http://www.w3.org/1999/html" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:fo="http://www.w3.org/1999/XSL/Format" version="2.0" xmlns:gml="http://www.opengis.net/gml" xmlns:wfs="http://www.opengis.net/wfs">
	<xsl:output method="text" indent="yes" media-type="text/plain" encoding="UTF-8"/>
	<xsl:template match="*:ExceptionReport|*:ServiceExceptionReport">
	</xsl:template>
	<xsl:template match="*:FeatureCollection|*:ValueCollection">
		<xsl:text>{</xsl:text>
		<xsl:text>epsg: "</xsl:text>
		<xsl:value-of select="*:boundedBy/*:Envelope/@srsName"/>
		<xsl:text>", envelope: "</xsl:text>
		<xsl:apply-templates select="*:boundedBy"/>
		<xsl:text>",</xsl:text>
		<xsl:text>feature:[</xsl:text>
		<xsl:apply-templates select="descendant::*:pos|descendant::*:posList"/>
		<xsl:text>null]}</xsl:text>
	</xsl:template>
	<xsl:template match="*:boundedBy">
		<xsl:value-of select="normalize-space(*:Envelope/*:lowerCorner/.)"/>
		<xsl:text>0 0</xsl:text>
		<xsl:value-of select="normalize-space(*:Envelope/*:upperCorner/.)"/>
	</xsl:template>
	<xsl:template match="*:pos|*:posList">
		<xsl:text>"</xsl:text>
		<xsl:value-of select="normalize-space(.)"/>
		<xsl:text>",</xsl:text>
	</xsl:template>
</xsl:stylesheet>
