<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:html="http://www.w3.org/1999/html" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:fo="http://www.w3.org/1999/XSL/Format" version="2.0" xmlns:gml="http://www.opengis.net/gml" xmlns:wfs="http://www.opengis.net/wfs">
	<xsl:output method="html" omit-xml-declaration="yes" indent="yes" media-type="text/html" encoding="UTF-8"/>
	<xsl:template match="*:ExceptionReport|*:ServiceExceptionReport">
		<html>
			<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
			<body bgcolor="white">
				<table align="center" cellspacing="5">
					<tr>
						<td colspan="2" bgcolor="silver">
							<b>
								<xsl:value-of select="local-name(.)"/>
							</b>
						</td>
					</tr>
					<xsl:apply-templates select="child::*"/>
					<tr>
						<td colspan="2" align="center">
							<script>document.write(new Date());</script>
						</td>
					</tr>
				</table>
			</body>
		</html>
	</xsl:template>
	<xsl:template match="*:FeatureCollection|*:ValueCollection">
		<html>
			<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
			<body bgcolor="white">
				<table align="center" cellspacing="5">
					<xsl:apply-templates select="*:boundedBy|descendant::*:member|*:featureMember"/>
					<!-- xsl:apply-templates select="*:boundedBy|*:member|*/*/*:member|*:featureMember"/ -->
					<tr>
						<td colspan="2" align="center">
							<script>document.write(new Date());</script>
						</td>
					</tr>
				</table>
			</body>
		</html>
	</xsl:template>
	<xsl:template match="/*/*:boundedBy">
		<xsl:variable name="t">
			<xsl:value-of select="local-name(.)"/>
		</xsl:variable>
		<tr>
			<td colspan="2" bgcolor="silver">
				<b>
					<xsl:value-of select="local-name(.)"/>
				</b>
				<xsl:apply-templates select="child::*"/>
			</td>
			<td/>
		</tr>
	</xsl:template>
	<xsl:template match="*:featureMember">
		<tr>
			<td colspan="2" bgcolor="silver">
				<xsl:for-each select="child::*">
					<b>
						<xsl:value-of select="local-name(.)"/>
					</b>
					<xsl:apply-templates select="child::*"/>
				</xsl:for-each>
			</td>
			<td/>
		</tr>
	</xsl:template>
	<xsl:template match="*:member">
		<xsl:if test="child::*">
			<tr>
				<td colspan="2" bgcolor="silver">
					<xsl:for-each select="child::*">
						<b>
							<xsl:value-of select="local-name(.)"/>
						</b>
						<xsl:apply-templates select="child::*"/>
					</xsl:for-each>
				</td>
				<td/>
			</tr>
		</xsl:if>
	</xsl:template>
	<xsl:template match="child::*">
		<xsl:variable name="tagName">
			<xsl:value-of select="local-name( . )"/>
		</xsl:variable>
		<xsl:variable name="tagValue">
			<xsl:value-of select="text()"/>
		</xsl:variable>
		<!-- xsl:call-template name="displayAttributes">
			<xsl:with-param name="name" select="$tagName"/>
			<xsl:with-param name="value" select="$tagValue"/>
		</xsl:call-template -->
		<xsl:call-template name="displayField">
			<xsl:with-param name="name" select="$tagName"/>
			<xsl:with-param name="value" select="$tagValue"/>
		</xsl:call-template>
	</xsl:template>
	<xsl:template name="displayField">
		<xsl:param name="name"/>
		<xsl:param name="value"/>
		<xsl:choose>
			<xsl:when test="* or $value = ''">
				<xsl:for-each select="*">
					<xsl:variable name="tagName">
						<xsl:value-of select="$name"/>
						<xsl:text>|</xsl:text>
						<xsl:value-of select="local-name( . )"/>
					</xsl:variable>
					<xsl:variable name="tagValue">
						<xsl:value-of select="$value"/>
						<xsl:value-of select="text()"/>
					</xsl:variable>
					<xsl:call-template name="displayField">
						<xsl:with-param name="name" select="$tagName"/>
						<xsl:with-param name="value" select="$tagValue"/>
					</xsl:call-template>
				</xsl:for-each>
			</xsl:when>
			<xsl:otherwise>
				<tr>
					<td bgcolor="whitesmoke">
						<nobr>
							<xsl:call-template name="multiLineText">
								<xsl:with-param name="text" select="$name"/>
								<xsl:with-param name="indent" select="''"/>
							</xsl:call-template>
						</nobr>
					</td>
					<td bgcolor="whitesmoke">
						<xsl:choose>
							<xsl:when test="starts-with( $value, 'http://') ">
								<a>
									<xsl:attribute name="href"><xsl:value-of select="$value"/></xsl:attribute>
									<xsl:attribute name="target"><xsl:value-of select="'_blank'"/></xsl:attribute>
									<xsl:value-of select="$value"/>
								</a>
							</xsl:when>
							<xsl:otherwise>
								<xsl:choose>
									<xsl:when test="ends-with($name, 'posList')">
										<xsl:value-of select="'...'"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:value-of select="$value"/>
									</xsl:otherwise>
								</xsl:choose>
							</xsl:otherwise>
						</xsl:choose>
					</td>
				</tr>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="multiLineText">
		<xsl:param name="text"/>
		<xsl:param name="indent"/>
		<xsl:variable name="tab">
			<xsl:value-of select="$indent"/>
			<xsl:value-of select="'&#160;'"/>
		</xsl:variable>
		<xsl:choose>
			<xsl:when test="contains($text, '|')">
				<xsl:value-of select="substring-before($text,'|')"/>
				<br/>
				<xsl:value-of select="$tab"/>
				<xsl:call-template name="multiLineText">
					<xsl:with-param name="text" select="substring-after($text,'|')"/>
					<xsl:with-param name="indent" select="$tab"/>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$text"/>
				<xsl:text>:</xsl:text>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
</xsl:stylesheet>
