/*
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import Utils from "@support/utils";

describe("publisher-004-04 : Endpoint testing - Loadbalance", () => {
    const { publisher, password, superTenant, testTenant} = Utils.getUserInfo();
    const endpoint = 'https://petstore.swagger.io/v2/store/inventory';

    const addLoadBalance = (tenant) => {
      cy.loginToPublisher(publisher, password, tenant);
        Utils.addAPI({}).then((apiId) => {
            cy.visit({url:`/publisher/apis/${apiId}/overview`, retryOnStatusCodeFailure: true});
            cy.get('#itest-api-details-api-config-acc').click();
            cy.get('#left-menu-itemendpoints').click();
            cy.get('[data-testid="http/restendpoint-add-btn"]').click();

            // Add the prod and sandbox endpoints
            cy.get('#production-endpoint-checkbox').click();
            cy.get('#sandbox-endpoint-checkbox').click();
            cy.get('#production_endpoints').focus().type(endpoint);
            cy.get('#sandbox_endpoints').focus().type(endpoint);

            // load balance
            cy.get('#panel1bh-header').click();
            cy.get('#certificateEndpoint').click({force: true});
            cy.get('#config-type-load_balance').click({force: true});

            // add prod endpoints for failover
            cy.get('#production_endpoints-load_balance').focus().type(endpoint);
            cy.get('#production_endpoints-load_balance-add-btn').click();

            // add sandbox endpoints for failover
            cy.get('#sandbox_endpoints-load_balance').focus().type(endpoint);
            cy.get('#sandbox_endpoints-load_balance-add-btn').click();
            // Save
            cy.get('#endpoint-save-btn').click();

            // Check the values
            cy.get('#production_endpoints').should('have.value', endpoint);
            cy.get('#sandbox_endpoints').should('have.value', endpoint);
            // Test is done. Now delete the api
            Utils.deleteAPI(apiId);
        });
    }

  it.only("Add REST endpoints for production and sandbox endpoints with LOAD balanced - super admin", {
    retries: {
      runMode: 3,
      openMode: 0,
    },
  }, () => {
    addLoadBalance(superTenant);
  });
  it.only("Add REST endpoints for production and sandbox endpoints with LOAD balanced - tenant user", {
    retries: {
      runMode: 3,
      openMode: 0,
    },
  }, () => {
    addLoadBalance(testTenant);
  });
});